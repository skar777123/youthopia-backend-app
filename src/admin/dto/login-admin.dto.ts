import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
    @IsString()
    @IsNotEmpty()
    admin_name: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
