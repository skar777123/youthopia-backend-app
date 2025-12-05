import { Injectable, BadRequestException, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema } from '../schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RedeemDto } from './dto/redeem.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {}

  private generateYid(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
  }

  async register(createUserDto: CreateUserDto): Promise<UserSchema> {
    const yid = this.generateYid();
    const user = new this.userModel({ ...createUserDto, Yid: yid, points: 0 });
    return user.save();
  }

  async login(loginDto: LoginDto): Promise<UserSchema> {
    const user = await this.userModel.findOne({ mobile: loginDto.mobile, password: loginDto.password });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async fetchData(yid: string): Promise<UserSchema | null> {
    return this.userModel.findOne({ Yid: yid });
  }

  async redeem(yid: string, redeemDto: RedeemDto): Promise<UserSchema> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.points < redeemDto.points) {
      throw new BadRequestException('Insufficient points');
    }
    user.points -= redeemDto.points;
    user.redeemption = { ...user.redeemption, [redeemDto.item]: true };
    return user.save();
  }

  async spinWheel(yid: string): Promise<{ points: number }> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const points = Math.floor(Math.random() * 100) + 1; // Random points 1-100
    user.points += points;
    await user.save();
    return { points };
  }

  async getPoints(yid: string): Promise<{ points: number }> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { points: user.points };
  }
}
