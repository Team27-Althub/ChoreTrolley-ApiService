import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  comparePassword(
    password: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, encrypted);
  }

  public async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
