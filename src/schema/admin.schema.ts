import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class adminSchema {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ default: 'admin' })
  role: String;

  @Prop({ type: Object })
  transactions: Object;
}

export const admin = SchemaFactory.createForClass(adminSchema);
