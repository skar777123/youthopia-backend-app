import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { EventFeedback, EventFeedbackSchema, SpinFeedback, SpinFeedbackSchema } from '../schema/feedback.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EventFeedback.name, schema: EventFeedbackSchema },
            { name: SpinFeedback.name, schema: SpinFeedbackSchema },
        ]),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule { }
