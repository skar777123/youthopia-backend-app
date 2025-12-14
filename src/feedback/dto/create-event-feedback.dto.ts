import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventFeedbackDto {
    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    @IsNotEmpty()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    emoji: string;

    @IsString()
    @IsOptional()
    comment?: string;
}
