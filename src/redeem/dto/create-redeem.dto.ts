import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRedeemDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    points: number;

    @IsOptional()
    @IsObject()
    transactions: Record<string, any>;
}
