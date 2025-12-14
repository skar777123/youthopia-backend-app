import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class redeemSchema {
  @Prop()
  name: string;

  @Prop()
  points: number;

  @Prop({ type: Object })
  transactions: Object;

  @Prop({ type: Object })
  approved: Object;

  @Prop({ default: 0 })
  completed: number;
}

export const redeem = SchemaFactory.createForClass(redeemSchema);
