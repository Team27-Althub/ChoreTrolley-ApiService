import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly moduleRef: ModuleRef,
  ) {}

  /*async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    const error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => ({ error: err }));
      if (canActivate) return true;
    }
    throw error;
  }*/

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read auth type metadata (defaults to Bearer)
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    for (const type of authTypes) {
      if (type === AuthType.None) return true;

      if (type === AuthType.Bearer) {
        //👇Resolve AccessTokenGuard from DI container at runtime
        // this solved the guard rules access control level
        const accessTokenGuard = this.moduleRef.get(AccessTokenGuard, {
          strict: false,
        });

        const canActivate = await Promise.resolve(
          accessTokenGuard.canActivate(context),
        ).catch(() => false);

        if (canActivate) return true;
      }
    }

    throw new UnauthorizedException();
  }
}
