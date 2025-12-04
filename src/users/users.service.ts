import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCount = 1;

  async create(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: this.idCount++,
      username,
      email,
      password: hashed,
    };

    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.users.find((u) => u.id === id);
  }
}
''