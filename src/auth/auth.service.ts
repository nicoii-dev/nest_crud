import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const payload = {
      ...createUserDto,
      password: hashedPassword,
    };
    return this.usersService.register(payload);
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    userData: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }> {
    const user = await this.usersService.validateEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
        userData: payload,
      };
    }
    throw new Error('Invalid credentials');
  }
}
