import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
    @IsOptional()
    @IsString()
    event: string;

    @IsNotEmpty()
    @IsObject()
    user: Record<string, any>;

    @IsNotEmpty()
    @IsNumber()
    points: number;

    @IsOptional()
    @IsString()
    admin: string;
}
