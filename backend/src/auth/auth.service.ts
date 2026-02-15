import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(pass, user.passwordHash))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result as User;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, pass: string, name: string): Promise<User> {
    const existing = await this.usersService.findOne(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(pass, salt);

    const user = new User();
    user.email = email;
    user.passwordHash = passwordHash;
    user.name = name;
    user.createdAt = new Date().toISOString();

    return this.usersService.create(user);
  }
}
