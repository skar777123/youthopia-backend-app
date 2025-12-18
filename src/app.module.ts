import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { TransactionModule } from './transaction/transaction.module';
import { RedeemModule } from './redeem/redeem.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/youthopia'),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        port: 6379,
        ttl: 1000,
      }),
    }),
    UserModule,
    EventModule,
    TransactionModule,
    RedeemModule,
    LeaderboardModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
