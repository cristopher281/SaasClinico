import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { env } from '../../../config/env';

@Injectable()
export class NotificationDispatcherService {
  async sendTemporaryCredentials(payload: {
    clinicName: string;
    recipientName: string;
    recipientEmail: string;
    role: string;
    temporaryPassword: string;
  }) {
    if (env.notifications.mode === 'disabled') {
      return {
        mode: 'disabled',
        delivered: false,
      };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}-${payload.recipientEmail.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const targetDir = join(process.cwd(), env.notifications.outputDir);
    await mkdir(targetDir, { recursive: true });
    const targetPath = join(targetDir, fileName);

    await writeFile(
      targetPath,
      JSON.stringify(
        {
          subject: `Credenciales temporales - ${payload.clinicName}`,
          ...payload,
        },
        null,
        2,
      ),
      'utf8',
    );

    return {
      mode: 'file',
      delivered: true,
      targetPath,
    };
  }
}
