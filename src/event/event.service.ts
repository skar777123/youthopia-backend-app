import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParticipateEventDto } from './dto/participate-event.dto';
import { Event, EventSchema } from '../schema/event.schema';
import { User, UserSchema } from '../schema/user.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<EventSchema> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

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

    if (user.name !== name) {
      throw new NotFoundException('User verification failed: Name mismatch');
    }

    // Check if user already registered
    if (!user.registered) {
      user.registered = {};
    }

    if (user.registered[eventId]) {
      return { message: 'User already registered for this event' };
    }

    // Update event participant count
    event.participant_count += 1;
    await event.save();

    // Update user registered events
    user.registered = { ...user.registered, [eventId]: { name: event.name, date: new Date() } };
    // Mongoose might not detect deep object changes unless we markModified or reassign
    user.markModified('registered');
    await user.save();

    return { message: 'Successfully registered for event', event, user };
  }
}
