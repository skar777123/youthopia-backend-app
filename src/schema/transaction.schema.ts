import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class transactionSchema {
  @Prop()
  event: string;

  @Prop()
  user: Object;

  @Prop()
  points: number;

  @Prop()
  admin: string;
}

export const transaction = SchemaFactory.createForClass(transactionSchema);
