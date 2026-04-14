import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

type EnvConfig = {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  printer: {
    mode: 'disabled' | 'file' | 'network';
    outputDir: string;
    host: string;
    port: number;
  };
  assets: {
    uploadsDir: string;
  };
  notifications: {
    mode: 'disabled' | 'file';
    outputDir: string;
  };
};

function parseEnvFile(filePath: string): Record<string, string> {
  const contents = readFileSync(filePath, 'utf8');
  return contents.split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return acc;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return acc;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');
    acc[key] = value;
    return acc;
  }, {});
}

function loadEnvFile(): void {
  const candidates = [
    resolve(process.cwd(), '.env'),
    join(__dirname, '../../../.env'),
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const values = parseEnvFile(candidate);
    for (const [key, value] of Object.entries(values)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
    break;
  }
}

function readNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`La variable ${name} debe ser numérica.`);
  }

  return parsed;
}

function readString(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`La variable ${name} es obligatoria.`);
  }
  return value;
}

loadEnvFile();

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readNumber('PORT', 3000),
  corsOrigin: readString('CORS_ORIGIN', '*'),
  database: {
    host: readString('DB_HOST', 'localhost'),
    port: readNumber('DB_PORT', 5432),
    user: readString('DB_USER', 'admin'),
    password: readString('DB_PASSWORD', 'supersecretpassword'),
    name: readString('DB_NAME', 'saas_clinica_db'),
  },
  jwt: {
    secret: readString('JWT_SECRET', 'change-this-secret-in-production'),
    expiresIn: readString('JWT_EXPIRES_IN', '8h'),
  },
  printer: {
    mode: readString('PRINTER_MODE', 'disabled') as 'disabled' | 'file' | 'network',
    outputDir: readString('PRINTER_OUTPUT_DIR', 'prints'),
    host: readString('PRINTER_HOST', '127.0.0.1'),
    port: readNumber('PRINTER_PORT', 9100),
  },
  assets: {
    uploadsDir: readString('UPLOADS_DIR', 'uploads'),
  },
  notifications: {
    mode: readString('NOTIFICATIONS_MODE', 'file') as 'disabled' | 'file',
    outputDir: readString('NOTIFICATIONS_OUTPUT_DIR', 'outbox'),
  },
};
