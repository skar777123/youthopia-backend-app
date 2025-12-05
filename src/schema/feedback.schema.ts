import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class feedbackSchema {
  @Prop()
  name: string;

  @Prop()
  date: string;

  @Prop()
  collage: string;

  @Prop()
  response: string;
}

export const feedback = SchemaFactory.createForClass(feedbackSchema);
