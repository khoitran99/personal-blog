import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const adminSecret = process.env.ADMIN_SECRET;
    const providedSecret = request.headers['x-admin-secret'];

    if (!adminSecret) {
      console.warn('ADMIN_SECRET not set, allowing all requests (unsafe)');
      return true;
    }

    if (providedSecret !== adminSecret) {
      throw new UnauthorizedException('Invalid Admin Secret');
    }

    return true;
  }
}
