import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUsersDto } from '../dtos/create-users.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { MailService } from '../../mail/providers/mail.service';
import { OtpService } from '../../otp/otp.service';
import { UserStatus } from '../enums/user-status';
import { GenerateTokensProvider } from '../../auth/providers/generate-tokens.provider';

@Injectable()
export class CreateUserProvider {
  /**
   * Injecting userRepository
   */
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    /**
     * circular dependencies
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly _hashingProvider: HashingProvider,
    private readonly _tokenProvider: GenerateTokensProvider,
    /**
     * Mail service injection
     */
    private readonly _mailService: MailService,
    /**
     * Otp service injection
     */
    private readonly _otpService: OtpService,
  ) {}

  /**
   * New user registration
   * @param createUserDto
   */
  public async userRegistration(createUserDto: CreateUsersDto) {
    let userExists = undefined;

    try {
      /* check if user exists with email */
      userExists = await this._usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request. try later',
        {
          description: `Error tyring to connect - ${error.message}`,
        },
      );
    }

    if (userExists) {
      throw new BadRequestException(`${createUserDto.email} already exists`);
    }

    /**
     * create new user with hashed password
     */
    let newUser = this._usersRepository.create({
      ...createUserDto,
      password: await this._hashingProvider.hashPassword(
        createUserDto.password,
      ),
    });

    try {
      newUser = await this._usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request. try later',
        {
          description: `Error trying to connect: ${error.message}`,
        },
      );
    }

    //create otp
    const token = await this._tokenProvider.generateTokens(newUser);
    const urlActivate = `${process.env.FRONTEND_URL}?token=${token.accessToken}`;

    //test email notification using mailTrap test account
    //do not throw error on production should mailTrap fails
    try {
      await this._mailService.sendUserWelcome2(newUser, urlActivate);
    } catch (e) {
      throw new RequestTimeoutException(e);
    }

    return newUser;
  }

  async tokenVerification(token: string) {
    const user = await this._tokenProvider.tokenVerification(token);
    console.log('PromiseUserProvider', user);
    const userFound = await this._usersRepository.findOne({
      where: {
        id: user.sub,
        email: user.email,
      },
    });
    if (!userFound) {
      throw new BadRequestException('User not found');
    }
    userFound.status = UserStatus.Verified;
    return await this._usersRepository.save(userFound);
  }

  async verifyActiveToken(userId: number, token: string) {
    await this._otpService.verifyOtp(userId, token);
    const user = await this._usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.status = UserStatus.Verified;
    return await this._usersRepository.save(user);
  }

  get usersRepository(): Repository<User> {
    return this._usersRepository;
  }

  get mailService(): MailService {
    return this._mailService;
  }

  get otpService(): OtpService {
    return this._otpService;
  }
}
