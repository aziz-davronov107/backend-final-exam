import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PUBLIC } from '../decorators/publick.decorator'; // agar @Public() ishlatmoqchi bo'lsangiz

@Injectable()
export class AccessTokenGuard extends AuthGuard('access-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}
