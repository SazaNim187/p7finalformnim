import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCount = 1;
  private filePath = path.join(__dirname, 'users.json');

  constructor() {
    // Load users from file if exists
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      this.users = JSON.parse(data);
      // Make sure idCount continues correctly
      this.idCount = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    }
  }

  private saveToFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
  }

  async create(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: this.idCount++,
      username,
      email,
      password: hashed,
    };

    this.users.push(newUser);
    this.saveToFile(); // persist to JSON file
    return newUser;
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.users.find((u) => u.id === id);
  }
}
