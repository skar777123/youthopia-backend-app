import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from '../schema/event.schema';
import { User, UserSchema } from '../schema/user.schema';

import { leaderboard, leaderboardSchema } from '../schema/leaderboard.schema';
import { transaction, transactionSchema } from '../schema/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventSchema.name, schema: Event },
      { name: UserSchema.name, schema: User },
      { name: leaderboardSchema.name, schema: leaderboard },
      { name: transactionSchema.name, schema: transaction },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
