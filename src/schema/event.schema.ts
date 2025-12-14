import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class EventSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  participant_count: number;

  @Prop({ default: 0 })
  completed: number;

  @Prop({ type: Object })
  registered: Object;

  @Prop({ required: true })
  time: string
  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  imageColor: string;

  @Prop({ required: true, type: Object })
  prizes: Object;

  @Prop({ type: Object })
  schedule: Object;

  @Prop({ default: false })
  isTeamEvent: boolean;

  @Prop()
  images: string;

  @Prop({ type: Array })
  rules: string[];

  @Prop()
  quote: string;

  @Prop()
  category: string;

  @Prop()
  minMembers: number;

  @Prop()
  maxMembers: number;
}

export const Event = SchemaFactory.createForClass(EventSchema);
