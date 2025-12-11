import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

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
}
