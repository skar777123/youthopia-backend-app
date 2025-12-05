import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class leaderboardSchema {
  @Prop()
  name: string;

  @Prop()
  points: number;
}

export const leaderboard = SchemaFactory.createForClass(leaderboardSchema);
