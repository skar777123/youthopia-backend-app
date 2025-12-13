import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

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
    @IsNumber()
    points?: number;
}
