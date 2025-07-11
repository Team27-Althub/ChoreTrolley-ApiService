import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInProvider } from './sign-in.provider';
import { SigninDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject UserService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
     * Inject SignInProvider
     */
    private readonly signInProvider: SignInProvider,
  ) {}

  public async signIn(signInDto: SigninDto) {
    return await this.signInProvider.signIn(signInDto);
  }
}
