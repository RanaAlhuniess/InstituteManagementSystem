import {formatDate} from "../../config";

export class AvailabilityResponseDto {
    date: string;
    from: string;
    to: string;

    constructor(date, timeFrom: string, timeTo: string) {
        this.date = formatDate(date);
        this.from = timeFrom;
        this.to = timeTo;
    }
}