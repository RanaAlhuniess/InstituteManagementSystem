import {IsNumber, IsString} from "class-validator";

export class BookingRequestDto {
    @IsNumber()
    studentId: number;
    @IsString()
    date: string;

    @IsString()
    from: string;

    @IsString()
    to: string;
}