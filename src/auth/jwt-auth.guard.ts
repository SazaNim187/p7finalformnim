import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Invalid token');

    try {
      const payload = this.jwtService.verify(token, { secret: 'RIMESTx_187' });
      request['user'] = payload; // attach payload to request
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
