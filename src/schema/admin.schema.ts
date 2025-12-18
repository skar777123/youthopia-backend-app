import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  admin_name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  event_assigned: string;

  @Prop()
  event_code: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
