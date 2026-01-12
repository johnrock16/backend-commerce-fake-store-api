import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';

const logDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const fileStream = createStream('fake-store-api.log', {
  interval: '1d',
  path: logDir,
  maxFiles: 14,
  //   compress: "gzip",
});
