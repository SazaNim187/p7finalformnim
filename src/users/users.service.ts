import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private file = path.join(__dirname, 'users.json');
  private users: User[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(this.file)) {
      this.users = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } else {
      this.users = [];
    }
  }

  private save() {
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
  }

  async create(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: Date.now(),
      username,
      email,
      password: hashed,
    };

    this.users.push(newUser);
    this.save();
    return newUser;
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.users.find((u) => u.id === id);
  }
}
