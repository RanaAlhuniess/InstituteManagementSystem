import {IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword,} from 'class-validator';

export class RegisterRequestDto {

    @IsString()
    @IsNotEmpty()
    name: string = '';

    @IsEmail()
    @IsNotEmpty()
    email: string = '';

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string = '';

    @IsInt()
    @IsNotEmpty()
    roleId: number = 0 // TODO
}
