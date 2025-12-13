import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipateEventDto {
    @IsNotEmpty()
    @IsString()
    Yid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsOptional()
    team?: Object | Array<any>;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    points?: number;
}
