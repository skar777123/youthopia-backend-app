import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum } from 'class-validator';

export class CreateSpinFeedbackDto {
    @IsString()
    @IsNotEmpty()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNumber()
    @IsNotEmpty()
    prizeAmount: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['Events', 'Prizes', 'Community', 'Organization', 'Other'])
    favoriteAspect: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['Yes', 'No', 'Maybe'])
    wouldRecommend: string;
}
