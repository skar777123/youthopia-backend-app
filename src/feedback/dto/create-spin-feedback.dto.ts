import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class FeedbackResponseDto {
    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    questionText: string;

    @IsNotEmpty()
    answer: any;
}

export class CreateSpinFeedbackDto {
    @IsString()
    @IsNotEmpty()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNumber()
    @IsOptional()
    prizeAmount: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeedbackResponseDto)
    responses: FeedbackResponseDto[];
}
