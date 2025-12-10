import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { leaderboard, leaderboardSchema } from '../schema/leaderboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: leaderboardSchema.name, schema: leaderboard }]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule { }
