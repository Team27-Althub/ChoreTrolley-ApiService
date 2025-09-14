import { Injectable } from '@nestjs/common';
import { ProfileProvider } from './profile-provider';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { CreateProfileDto } from '../dtos/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly _profileProvider: ProfileProvider) {}

  async getProfile(userId: number) {
    return await this._profileProvider.getProfileById(userId);
  }

  async createOrUpdateProfile(userId: number, dto: CreateProfileDto) {
    Object.assign(dto, { userId });
    return await this._profileProvider.createOrUpdateProfile(dto);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const updateProfileDto = { ...dto, userId: userId };
    return await this._profileProvider.updateProfile(updateProfileDto);
  }
}
