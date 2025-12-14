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

  @Prop({ required: true, type: Object })
  registered: Object;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true, type: Object })
  prizes: Object;

  @Prop({ type: Object })
  schedule: Object;

  @Prop()
  images: string;
  
  @Prop()
  category: string;
}

export const Event = SchemaFactory.createForClass(EventSchema);
