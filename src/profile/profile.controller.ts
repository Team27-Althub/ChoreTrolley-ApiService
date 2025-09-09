import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './providers/profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('Profile Module')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: number,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return await this.profileService.createProfile(userId, createProfileDto);
  }

  @Get()
  async getProfileByUserId(@CurrentUser('sub') userId: number) {
    return await this.profileService.getProfile(userId);
  }

  @Patch()
  async update(
    @CurrentUser('sub') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.updateProfile(userId, updateProfileDto);
  }
}
