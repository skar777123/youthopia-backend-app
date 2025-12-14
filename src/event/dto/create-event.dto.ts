import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsOptional()
    @IsNumber()
    participant_count: number;

    @IsOptional()
    @IsNumber()
    completed: number;

    @IsNotEmpty()
    @IsNumber()
    points: number;

    @IsNotEmpty()
    @IsObject()
    prizes: Record<string, any>;

    @IsOptional()
    @IsObject()
    schedule: Record<string, any>;

    @IsOptional()
    @IsString()
    images: string;

    @IsOptional()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsString()
    time: string;

    @IsNotEmpty()
    @IsString()
    imageColor: string;

    @IsOptional()
    @IsBoolean()
    isTeamEvent: boolean;

    @IsOptional()
    @IsArray()
    rules: string[];

    @IsOptional()
    @IsString()
    quote: string;

    @IsOptional()
    @IsNumber()
    minMembers: number;

    @IsOptional()
    @IsNumber()
    maxMembers: number;
}
