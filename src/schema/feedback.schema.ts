import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: true })
  prizeAmount: number; // The amount won (e.g., 10, 20, 30...)

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // 1-5 Star rating

  @Prop({
    required: true,
    enum: ['Events', 'Prizes', 'Community', 'Organization', 'Other']
  })
  favoriteAspect: string;

  @Prop({
    required: true,
    enum: ['Yes', 'No', 'Maybe']
  })
  wouldRecommend: string;
}

export const SpinFeedbackSchema = SchemaFactory.createForClass(SpinFeedback);