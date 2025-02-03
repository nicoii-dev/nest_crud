import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.find(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    userData: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }> {
    const user = await this.usersService.findOne(1);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
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
}
