import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { Socket } from 'net';
import { env } from '../../../config/env';

type PrintResult = {
  mode: string;
  destination: string;
  printed: boolean;
};

@Injectable()
export class TicketPrinterService {
  async print(invoiceNumber: string, ticketText: string): Promise<PrintResult> {
    if (env.printer.mode === 'disabled') {
      return {
        mode: 'disabled',
        destination: 'preview-only',
        printed: false,
      };
    }

    if (env.printer.mode === 'file') {
      const filename = join(env.printer.outputDir, `${invoiceNumber}.txt`);
      await mkdir(dirname(filename), { recursive: true });
      await writeFile(filename, ticketText, 'utf8');
      return {
        mode: 'file',
        destination: filename,
        printed: true,
      };
    }

    await this.sendToNetworkPrinter(this.buildEscPosBuffer(ticketText));
    return {
      mode: 'network',
      destination: `${env.printer.host}:${env.printer.port}`,
      printed: true,
    };
  }

  private sendToNetworkPrinter(buffer: Buffer) {
    return new Promise<void>((resolve, reject) => {
      const socket = new Socket();
      socket.connect(env.printer.port, env.printer.host, () => {
        socket.write(buffer);
        socket.end();
      });

      socket.on('close', () => resolve());
      socket.on('error', (error) => reject(error));
    });
  }

  private buildEscPosBuffer(text: string) {
    const init = Buffer.from([0x1b, 0x40]);
    const alignLeft = Buffer.from([0x1b, 0x61, 0x00]);
    const cut = Buffer.from([0x1d, 0x56, 0x41, 0x10]);
    const content = Buffer.from(`${text}\n\n`, 'ascii');
    return Buffer.concat([init, alignLeft, content, cut]);
  }
}
