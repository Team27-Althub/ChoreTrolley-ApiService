import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { User } from '../../users/providers/user.entity';

@Injectable()
export class ProfileProvider {
  constructor(
    @InjectRepository(Profile)
    private readonly _profileRepository: Repository<Profile>,
    /**
     *
     */
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async getProfileById(id: number): Promise<Profile> {
    return this.findProfileByUserId(id);
  }

  async createOrUpdateProfile(dto: CreateProfileDto): Promise<Profile> {
    const user = await this._userRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if a profile exists
    let profile = await this._profileRepository.findOne({
      where: { user: { id: dto.userId } },
    });

    profile = profile
      ? this._profileRepository.merge(profile, dto)
      : this._profileRepository.create({ ...dto, user });

    //const profile = this._profileRepository.create({ ...dto, user });
    return await this._profileRepository.save(profile);
  }

  async updateProfile(dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findProfileByUserId(dto.userId);
    if (!profile) throw new NotFoundException('Profile not found');
    this._profileRepository.merge(profile, dto);
    return await this._profileRepository.save(profile);
  }

  private async findProfileByUserId(userId: number) {
    return this._profileRepository.findOne({
      where: { userId: userId },
      relations: ['user'],
    });
  }
}
