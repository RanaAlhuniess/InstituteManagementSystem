import {IsNumber, IsString} from "class-validator";

export class BookingRequestDto {
    @IsNumber()
    studentId: number;
    @IsNumber()
    instructorId?: number;
    @IsString()
    date: string;

    @IsString()
    from: string;

    @IsString()
    to: string;
}