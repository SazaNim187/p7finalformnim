import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already used');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.users.create(username, email, hashed);

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, username: user.username });

    return { access_token: token }; // matches frontend expectation
  }
}
