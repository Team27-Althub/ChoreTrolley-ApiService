import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from '../dtos/create-users.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting Profile Config
     */
    @Inject(profileConfig.KEY)
    private _profileConfiguration: ConfigType<typeof profileConfig>,
    /**
     * Inject CreateUserProvider
     */
    private readonly _createUserProvider: CreateUserProvider,
    /**
     * Inject FindUserByEmailProvider for proxy pattern
     */
    private readonly _findUserByEmailProvider: FindUserByEmailProvider,
    /**
     * Inject FindOneByGoogleIdProvider
     */
    private readonly _findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    /**
     * Create google user provider
     */
    private readonly _createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  /**
   * New user registration
   * @param createUserDto
   */
  public async userRegistration(createUserDto: CreateUsersDto) {
    return this._createUserProvider.userRegistration(createUserDto);
  }

  /**
   * Update user account
   * @param user
   */
  public async updateUserAccount(user: User) {
    return this._createUserProvider.usersRepository.save(user);
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
    return await this._findUserByEmailProvider.findOneByEmail(email);
  }

  /**
   * find user by id
   */
  public async findUserByUserId(id: number) {
    return await this._findUserByEmailProvider.findUserById(id);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this._findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this._createGoogleUserProvider.createGoogleUser(googleUser);
  }

  async verifyActiveOtp(userId: number, token: string) {
    return this._createUserProvider.verifyActiveToken(userId, token);
  }

  get profileConfiguration(): ConfigType<typeof profileConfig> {
    return this._profileConfiguration;
  }

  get createUserProvider(): CreateUserProvider {
    return this._createUserProvider;
  }

  get findUserByEmailProvider(): FindUserByEmailProvider {
    return this._findUserByEmailProvider;
  }

  get findOneByGoogleIdProvider(): FindOneByGoogleIdProvider {
    return this._findOneByGoogleIdProvider;
  }

  get createGoogleUserProvider(): CreateGoogleUserProvider {
    return this._createGoogleUserProvider;
  }
}
