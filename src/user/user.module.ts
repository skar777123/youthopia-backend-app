import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schema/user.schema';
import { leaderboard, leaderboardSchema } from '../schema/leaderboard.schema';
import { transaction, transactionSchema } from '../schema/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: User },
      { name: leaderboardSchema.name, schema: leaderboard },
      { name: transactionSchema.name, schema: transaction },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
