import { IStorageService } from '../interfaces/storage.interface';
import * as path from 'node:path';
import * as fs from 'node:fs';

export class LocalStorageProvider implements IStorageService {
  //private uploadPath = path.resolve(__dirname, '../../uploads');
  private uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(this.uploadPath, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    console.log('filePath:called');
    console.log(filePath);
    return `/uploads/${fileName}`;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }
}
