import moment from 'moment';

export class InstructorAvailabilityEntity {
    id: number;
    dayOfWeek: string;

    timeFrom: string;

    timeTo: string;

    activeFrom: string;

    activeTo: string;

    constructor(id: number, dayOfWeek: string, timeTo: Date, timeFrom: Date, activeFrom: Date, activeTo: Date | null) {
        const extractTime = (date: Date) => moment(date).format('HH:mm:ss');
        this.timeFrom = extractTime(new Date(timeFrom));
        this.timeTo = extractTime(new Date(timeTo));
        this.dayOfWeek = dayOfWeek;
        this.activeFrom = moment(activeFrom).format('YYYY-MM-DD');
        this.activeTo = activeTo
            ? moment(activeTo).format('YYYY-MM-DD')
            : null;
    }
}