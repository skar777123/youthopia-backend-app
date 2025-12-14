import { IsNumber, IsOptional } from 'class-validator';

export class SpinDto {
    @IsNumber()
    @IsOptional()
    points: number;

    @IsNumber()
    @IsOptional()
    spins: number;
}
