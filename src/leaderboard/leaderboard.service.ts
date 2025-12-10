import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { leaderboard, leaderboardSchema } from '../schema/leaderboard.schema';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(leaderboardSchema.name) private leaderboardModel: Model<leaderboardSchema>,
  ) { }

  async create(createLeaderboardDto: CreateLeaderboardDto): Promise<leaderboardSchema> {
    const createdLeaderboard = new this.leaderboardModel(createLeaderboardDto);
    return createdLeaderboard.save();
  }

  async findAll(): Promise<leaderboardSchema[]> {
    return this.leaderboardModel.find().sort({ points: -1 }).exec();
  }

  async findOne(id: string): Promise<leaderboardSchema> {
    const entry = await this.leaderboardModel.findById(id).exec();
    if (!entry) {
      throw new NotFoundException(`Leaderboard entry with ID ${id} not found`);
    }
    return entry;
  }

  async update(id: string, updateLeaderboardDto: UpdateLeaderboardDto): Promise<leaderboardSchema> {
    const updatedEntry = await this.leaderboardModel
      .findByIdAndUpdate(id, updateLeaderboardDto, { new: true })
      .exec();
    if (!updatedEntry) {
      throw new NotFoundException(`Leaderboard entry with ID ${id} not found`);
    }
    return updatedEntry;
  }

  async remove(id: string): Promise<leaderboardSchema> {
    const deletedEntry = await this.leaderboardModel.findByIdAndDelete(id).exec();
    if (!deletedEntry) {
      throw new NotFoundException(`Leaderboard entry with ID ${id} not found`);
    }
    return deletedEntry;
  }
}
