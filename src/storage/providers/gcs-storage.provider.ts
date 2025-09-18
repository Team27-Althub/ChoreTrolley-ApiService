import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { IStorageService } from '../interfaces/storage.interface';

@Injectable()
export class GcsStorageProvider implements IStorageService {
  private bucket: Bucket;

  constructor() {
    const storage = new Storage({
      keyFilename: process.env.GCP_KEYFILE_PATH,
      projectId: process.env.GCP_PROJECT_ID,
    });
    this.bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const blob = this.bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.on('error', (err) => reject(err));
      blobStream.end(file.buffer);
    });
  }

  async uploadFiles?(files: Express.Multer.File[]): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
