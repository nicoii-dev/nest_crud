import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = await this.userRepository.create(createUserDto);
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);
    const userData = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(userData);
  }

  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    return await this.userRepository.remove(existingUser);
  }

  // for auth
  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      // customize error response
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Email is already taken',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const payload = {
      ...createUserDto,
      password: hashedPassword,
    };
    const userData = await this.userRepository.create(payload);
    return this.userRepository.save(userData);
  }

  async validateEmail(email: string): Promise<User> {
    const userData = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    return userData;
  }
}
