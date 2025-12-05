import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class RedeemDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;
}
