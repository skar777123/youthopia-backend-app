import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParticipateEventDto } from './dto/participate-event.dto';
import { Event, EventSchema } from '../schema/event.schema';
import { User, UserSchema } from '../schema/user.schema';
import { leaderboardSchema } from '../schema/leaderboard.schema';
import { transactionSchema } from '../schema/transaction.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    @InjectModel(leaderboardSchema.name) private leaderboardModel: Model<leaderboardSchema>,
    @InjectModel(transactionSchema.name) private transactionModel: Model<transactionSchema>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<EventSchema> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  // ... (rest of the file until participate)

  // (Assuming I should keep existing methods, I'll use target replacement carefully)

  // Method to complete event
  async complete(eventId: string, userDto: ParticipateEventDto): Promise<any> {
    const { Yid, name, _id } = userDto;
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.userModel.findById(_id) as any;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.Yid !== Yid) {
      throw new NotFoundException('User verification failed: Yid mismatch');
    }

    // Check if already completed
    if (user.completed && user.completed[eventId]) {
      return { message: 'Event already completed by user' };
    }

    // Add points
    const points = event.points || 0;
    user.points += points;

    // Update user completed
    user.completed = { ...user.completed, [eventId]: { name: event.name, date: new Date(), points: points } };
    user.markModified('completed');
    await user.save();

    // Update event completed count (optional if needed)
    // event.completed += 1; // Assuming completed is a number count
    // await event.save();

    // Update Leaderboard
    await this.updateLeaderboard(user.name, user.points);

    // Create Transaction
    const newTransaction = new this.transactionModel({
      event: `Event Complete: ${event.name}`,
      user: { name: user.name, Yid: user.Yid },
      points: points,
      admin: 'System'
    });
    await newTransaction.save();

    return { message: 'Event completed successfully', points };
  }

  private async updateLeaderboard(name: string, points: number) {
    await this.leaderboardModel.findOneAndUpdate({ name }, { points }, { upsert: true });
  }

  // existing participate method...


  async findAll(): Promise<EventSchema[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<EventSchema> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventSchema> {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return updatedEvent;
  }

  async remove(id: string): Promise<EventSchema> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return deletedEvent;
  }

  async participate(eventId: string, userDto: ParticipateEventDto): Promise<any> {
    const { Yid, name, _id, team } = userDto;
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.userModel.findById(_id) as any;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.Yid !== Yid) {
      throw new NotFoundException('User verification failed: Yid mismatch');
    }

    // Check if user already registered
    if (!user.registered) {
      user.registered = {};
    }

    if (user.registered[eventId]) {
      return { message: 'User already registered for this event' };
    }

    // Update event registered
    if (!event.registered) {
      event.registered = {};
    }

    const participantData = team ? { name: name, team: team, Yid: Yid } : { name: name, Yid: Yid };

    // We update the map using Object.assign or spread to ensure Mongoose detects change if it's mixed type
    // But since it's @Prop({ type: Object }), we should just update the object and markModified.
    // Use Yid as key for uniqueness check within event if possible, but user might be in multiple teams? 
    // Assuming 1 participation per user per event.

    event.registered = { ...event.registered, [Yid]: participantData };
    event.markModified('registered');

    // Update event participant count
    event.participant_count += 1;
    await event.save();

    // Update user registered events
    user.registered = { ...user.registered, [eventId]: { name: event.name, date: new Date() } };
    user.markModified('registered');
    await user.save();

    return { message: 'Successfully registered for event', event, user };
  }
}
