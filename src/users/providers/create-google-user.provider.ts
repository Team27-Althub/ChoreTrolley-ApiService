import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GoogleUser } from '../interfaces/google-user.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    /**
     * User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not create user',
      });
    }
  }
}
