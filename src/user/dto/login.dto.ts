import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNumber()
  @IsNotEmpty()
  mobile: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
