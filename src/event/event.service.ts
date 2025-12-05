import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventSchema } from '../schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
  ) {}

  async fetchData(): Promise<EventSchema[]> {
    return this.eventModel.find().exec();
  }

  async getLeaderboard(): Promise<any[]> {
    // Assuming leaderboard is based on points from users, but since it's event, perhaps aggregate from users
    // For simplicity, return events with participant_count as leaderboard
    return this.eventModel.find().sort({ participant_count: -1 }).exec();
  }

  async getSchedule(): Promise<any[]> {
    return this.eventModel.find().select('name schedule').exec();
  }
}
