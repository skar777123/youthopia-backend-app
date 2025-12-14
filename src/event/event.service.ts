import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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


  async complete(eventId: string, userDto: ParticipateEventDto): Promise<any> {
    const { Yid, name, _id, team } = userDto;
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if team completion
    if (team && Array.isArray(team) && team.length > 0) {
      const pointsPerMember = Math.floor((event.points || 0) / team.length);
      const completionDate = new Date();

      for (const member of team) {
        if (!member.Yid) continue;
        const teamUser = await this.userModel.findOne({ Yid: member.Yid });
        if (!teamUser) {
          // Optionally log or skip
          continue;
        }

        // Check if already completed
        if (teamUser.completed && teamUser.completed[eventId]) {
          continue; // Skip if already completed for this user
        }

        // Add points
        teamUser.points += pointsPerMember;

        // Update user completed
        teamUser.completed = { ...teamUser.completed, [eventId]: { name: event.name, date: completionDate, points: pointsPerMember } };
        teamUser.markModified('completed');
        await teamUser.save();

        // Update event completed
        if (!event.completed) {
          event.completed = {};
        }
        event.completed = { ...event.completed, [member.Yid]: { name: teamUser.name, Yid: member.Yid, date: completionDate, points: pointsPerMember } };
        event.markModified('completed');

        // Update Leaderboard
        await this.updateLeaderboard(teamUser.name, teamUser.points);

        // Create Transaction
        const newTransaction = new this.transactionModel({
          event: `Event Complete (Team): ${event.name}`,
          user: { name: teamUser.name, Yid: teamUser.Yid },
          points: pointsPerMember,
          admin: 'System'
        });
        await newTransaction.save();
      }

      await event.save();
      return { message: 'Team event completed successfully', pointsPerMember };
    }

    // Single User Completion
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

    // Update event completed
    if (!event.completed) {
      event.completed = {};
    }
    event.completed = { ...event.completed, [Yid]: { name: user.name, Yid: Yid, date: new Date(), points: points } };
    event.markModified('completed');
    await event.save();

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


  async findAll(query?: any): Promise<EventSchema[]> {
    return this.eventModel.find(query || {}).exec();
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
    const { Yid, name, _id, team, points } = userDto;
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

    // Check team validation
    if (event.isTeamEvent) {
      if (!team) {
        throw new BadRequestException('This is a team event, team name is required');
      }
      // logic for member count validation if team Members list was provided can go here, 
      // but currently participate logic assumes single user processing per request.
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
    user.registered = { ...user.registered, [eventId]: { name: event.name, category: event.category, date: new Date() } };
    user.markModified('registered');

    // Award spin for every 4th registration of 'Engagement' category
    const engagementEventsCount = Object.values(user.registered).filter((evt: any) => evt.category === 'Engagement').length;

    if (engagementEventsCount > 0 && engagementEventsCount % 4 === 0) {
      user.spins = (user.spins || 0) + 1;
    }
    await user.save();

    // Award points for registration if provided
    if (points && points > 0) {
      user.points += points;
      await this.updateLeaderboard(user.name, user.points);

      const newTransaction = new this.transactionModel({
        event: `Event Registration: ${event.name}`,
        user: { name: user.name, Yid: user.Yid },
        points: points,
        admin: 'System'
      });
      await newTransaction.save();
    }

    await user.save();

    return { message: 'Successfully registered for event', event, user };
  }
}
