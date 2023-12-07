import moment from 'moment';
import {formatDate, formatTime} from "../config";

export class InstructorAvailabilityEntity {
    id: number;
    dayOfWeek: string;

    timeFrom: string;

    timeTo: string;

    activeFrom: string;

    activeTo: string;

    constructor(id: number, dayOfWeek: string, timeTo: Date, timeFrom: Date, activeFrom: Date, activeTo: Date | null) {
        this.timeFrom = formatTime(timeFrom);
        this.timeTo = formatTime(timeTo);
        this.dayOfWeek = dayOfWeek;
        this.activeFrom = formatDate(activeFrom);
        this.activeTo = activeTo
            ? formatDate(activeTo)
            : null;
    }
}