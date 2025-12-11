import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  institute: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({ required: true, unique: true })
  mobile: number;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  stream: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  Yid: string;

  @Prop({ required: true, default: 5})
  points: number;

  @Prop({ type: Object })
  transaction: Object;

  @Prop({ type: Object })
  redeemption: Object;

  @Prop({ type: Object })
  registered: Object;

  @Prop({ type: Object })
  completed: Object;

  @Prop({ type: Object })
  Schedule: Object;
}

export const User = SchemaFactory.createForClass(UserSchema);
