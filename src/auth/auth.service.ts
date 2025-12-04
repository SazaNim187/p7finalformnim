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
    console.log('Register attempt for email:', email, 'Existing user:', existing);

    if (existing) throw new UnauthorizedException('Email already used');

    const newUser = await this.users.create(username, email, password);
    console.log('New user created:', newUser);

    return newUser;
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    console.log('Login attempt for email:', email);
    console.log('User found:', user);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    console.log('Password match:', ok);

    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync({ sub: user.id });
    console.log('JWT token generated:', token);

    return { token };
  }
}
