import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtServicer: JwtService,
  ) {}
  async signIn(
    phone: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // Define a User type or import it if already defined
    type User = {
      userid: string;
      phone: string;
      password: string;
      username: string;
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const user = (await this.userService.findOne(phone)) as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { sub: user.userid, username: user.username };
    return {
      access_token: await this.jwtServicer.signAsync(payload),
    };
  }

  async signup(
    username: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const existingUser = await this.userService.findOne(phone);
    if (existingUser) {
      throw new ConflictException('Phone already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userService.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });
  }
}
