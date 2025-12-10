import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from '../schema/event.schema';
import { User, UserSchema } from '../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventSchema.name, schema: Event },
      { name: UserSchema.name, schema: User },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
