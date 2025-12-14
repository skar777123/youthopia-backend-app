import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema } from '../schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RedeemDto } from './dto/redeem.dto';
import { SpinDto } from './dto/spin.dto';
import * as crypto from 'crypto';

import { leaderboardSchema } from '../schema/leaderboard.schema';
import { transactionSchema } from '../schema/transaction.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    @InjectModel(leaderboardSchema.name) private leaderboardModel: Model<leaderboardSchema>,
    @InjectModel(transactionSchema.name) private transactionModel: Model<transactionSchema>,
  ) { }

  private generateYid(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
  }

  async findAll(): Promise<UserSchema[]> {
    return this.userModel.find().exec();
  }

  async register(createUserDto: CreateUserDto): Promise<UserSchema> {
    const yid = this.generateYid();
    const user = new this.userModel({ ...createUserDto, Yid: yid, points: 5 });
    const savedUser = await user.save();

    // Create leaderboard entry
    const newLeaderboardEntry = new this.leaderboardModel({ name: savedUser.name, points: 5 });
    await newLeaderboardEntry.save();

    // Create transaction for initial points
    const newTransaction = new this.transactionModel({
      event: 'Registration',
      user: { name: savedUser.name, Yid: savedUser.Yid },
      points: 5,
      admin: 'System'
    });
    await newTransaction.save();

    return savedUser;
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
    await user.save();

    // Update leaderboard (points decrease)
    await this.updateLeaderboard(user.name, user.points);
    // Create transaction
    const newTransaction = new this.transactionModel({
      event: `Redeem: ${redeemDto.item}`,
      user: { name: user.name, Yid: user.Yid },
      points: -redeemDto.points,
      admin: 'System'
    });
    await newTransaction.save();

    return user;
  }

  async spinWheel(yid: string, spinDto?: SpinDto): Promise<{ points: number; spins: number }> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.spins || user.spins <= 0) {
      throw new BadRequestException('No spins available');
    }

    let points = 0;
    if (spinDto && spinDto.points !== undefined) {
      points = spinDto.points;
    } else {
      points = Math.floor(Math.random() * 100) + 1; // Random points 1-100
    }

    user.points += points;

    // Deduct spins: use dto.spins if provided, otherwise default to 1
    const spinsToDeduct = (spinDto && spinDto.spins !== undefined) ? spinDto.spins : 1;
    user.spins -= spinsToDeduct;

    await user.save();

    await this.updateLeaderboard(user.name, user.points);

    const newTransaction = new this.transactionModel({
      event: 'Spin Wheel',
      user: { name: user.name, Yid: user.Yid },
      points: points,
      admin: 'System'
    });
    await newTransaction.save();

    return { points, spins: user.spins };
  }

  private async updateLeaderboard(name: string, points: number) {
    await this.leaderboardModel.findOneAndUpdate({ name }, { points }, { upsert: true });
  }

  async getPoints(yid: string): Promise<{ points: number }> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { points: user.points };
  }

  async getSpins(yid: string): Promise<{ spins: number }> {
    const user = await this.userModel.findOne({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { spins: user.spins || 0 };
  }

  async deleteUser(yid: string): Promise<UserSchema> {
    const user = await this.userModel.findOneAndDelete({ Yid: yid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
