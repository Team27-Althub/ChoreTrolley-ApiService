export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;
  uploadFiles?(files: Express.Multer.File[]): Promise<string[]>;
}
