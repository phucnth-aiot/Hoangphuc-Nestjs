import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth.constrant';
import { Request } from '@nestjs/common';
import { request } from 'http';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
  const token = this.extracTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
  try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret
      }
    );
      request['user'] = payload;
    } catch {
    throw new UnauthorizedException();
    }
    return true;
  }

  private extracTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
