import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

// ==========================================
// 1. Event Feedback Schema
// ==========================================

export type EventFeedbackDocument = EventFeedback & Document;

@Schema({ timestamps: true })
export class EventFeedback {
  @Prop({ required: true, index: true })
  eventId: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true, index: true })
  userEmail: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  emoji: string; // e.g., "🔥", "❤️", "😐"

  @Prop()
  comment?: string; // Optional text feedback
}

export const EventFeedbackSchema = SchemaFactory.createForClass(EventFeedback);

// ==========================================
// 2. Bonus (Spin) Feedback Schema
// ==========================================

export type SpinFeedbackDocument = SpinFeedback & Document;

@Schema({ timestamps: true })
export class SpinFeedback {
  @Prop({ required: true, index: true })
  userEmail: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ type: Number, default: 0 })
  prizeAmount: number;

  @Prop()
  category: string;

  @Prop({
    type: [
      {
        questionId: { type: String },
        questionText: { type: String },
        answer: { type: SchemaTypes.Mixed }, // Uses Mongoose Mixed type
      },
    ],
  })
  responses: {
    questionId: string;
    questionText: string;
    answer: any;
  }[];
}

export const SpinFeedbackSchema = SchemaFactory.createForClass(SpinFeedback);