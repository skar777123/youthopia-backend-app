import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedeemService } from './redeem.service';
import { RedeemController } from './redeem.controller';
import { redeem, redeemSchema } from '../schema/redeem.schema';
import { transaction, transactionSchema } from '../schema/transaction.schema';
import { User, UserSchema } from '../schema/user.schema';
import { leaderboard, leaderboardSchema } from '../schema/leaderboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: redeemSchema.name, schema: redeem },
      { name: transactionSchema.name, schema: transaction },
      { name: UserSchema.name, schema: User },
      { name: leaderboardSchema.name, schema: leaderboard },
    ]),
  ],
  controllers: [RedeemController],
  providers: [RedeemService],
})
export class RedeemModule { }
