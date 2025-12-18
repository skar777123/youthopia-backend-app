import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    admin_name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    event_assigned: string;

    @IsString()
    @IsOptional()
    event_code: string;
}
