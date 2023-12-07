import moment from "moment/moment";

export class AvailabilityResponseDto {
    date: string;
    from: string;
    to: string;

    constructor(date, timeFrom: string, timeTo: string) {
        this.date = moment(date).format('YYYY-MM-DD');
        this.from = timeFrom;
        this.to = timeTo;
    }
}