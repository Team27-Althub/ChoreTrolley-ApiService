import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from '../dtos/create-users.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting Profile Config
     */
    @Inject(profileConfig.KEY)
    private profileConfiguration: ConfigType<typeof profileConfig>,
    /**
     * Inject CreateUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Inject FindUserByEmailProvider for proxy pattern
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}

  /**
   * New user registration
   * @param createUserDto
   */
  public async userRegistration(createUserDto: CreateUsersDto) {
    return this.createUserProvider.userRegistration(createUserDto);
  }

  /**
   * Register using google oauth
   */
  public async registerByGoogleAccount() {}

  /**
   * find user by email through proxy
   * @param email
   */
  public async findUserByEmail(email: string) {
    return await this.findUserByEmailProvider.findOneByEmail(email);
  }

  /**
   * find user by id
   */
  public async findUserByUserId(id: number) {
    return await this.findUserByEmailProvider.findUserById(id);
  }
}
