import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLeaderboardDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    points: number;
}
