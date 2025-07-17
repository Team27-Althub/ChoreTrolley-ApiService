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

@Injectable()
export class CreateUserProvider {
  /**
   * Injecting userRepository
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    /**
     * circular dependencies
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    /**
     * Mail service injection
     */
    private readonly mailService: MailService,
  ) {}

  /**
   * New user registration
   * @param createUserDto
   */
  public async userRegistration(createUserDto: CreateUsersDto) {
    let userExists = undefined;

    try {
      /* check if user exists with email */
      userExists = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      //log error to the console
      console.error('CreateUserException:', error);
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request. try later',
        {
          description: `Error trying to connect: ${error.message}`,
        },
      );
    }

    //test email notification using mailTrap test account
    //do not throw error on production should mailTrap fails
    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (e) {
      throw new RequestTimeoutException(e);
    }

    return newUser;
  }
}
