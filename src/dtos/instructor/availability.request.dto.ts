import {IsString} from "class-validator";
import moment from "moment/moment";

export class AvailabilityRequestDto {
    @IsString()
    month: string = moment().format("YYYY-MM");

    // @IsDateString()
    // @IsEmpty()
    // date: Date
}