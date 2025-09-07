import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './providers/profile.service';
import { ProfileProvider } from './providers/profile-provider';
import { User } from '../users/providers/user.entity';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileProvider],
})
export class ProfileModule {}
