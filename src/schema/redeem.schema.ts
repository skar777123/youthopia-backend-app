import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class redeemSchema {
  @Prop()
  name: string;

  @Prop()
  points: number;

  @Prop({ type: Object })
  transactions: Object;
}

export const redeem = SchemaFactory.createForClass(redeemSchema);
