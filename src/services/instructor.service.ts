import {inject, injectable} from "inversify";
import {formatDate, formatTime, Logger} from "../config";
import {IInstructorRepository} from "../repositories/instructor/instructor.repository";
import {AvailabilityResponseDto} from "../dtos/instructor/availability.response.dto";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";
import {extendMoment} from 'moment-range';

const Moment = require('moment');

const moment = extendMoment(Moment);

@injectable()
export class InstructorService {
    constructor(@inject(IInstructorRepository) private readonly instructorRepository: IInstructorRepository, @inject(Logger) private readonly logger: Logger) {
    }

    async getInstructorAvailability(instructorId: number, month: string) {
        const monthDates = this._getDaysArrayByMonth(month);
        const startDate = monthDates[0].toDate();
        const endDate = monthDates[monthDates.length - 1].toDate();

        const availabilityConfiguration = await this.instructorRepository.getAvailability(instructorId, startDate, endDate);
        const instructorReservations = await this.instructorRepository.getReservations(instructorId, startDate, endDate);

        const result: AvailabilityResponseDto[] = [];
        for (let monthDate of monthDates) {

            //Check if the day is available
            const threeLetterDay = monthDate.format('ddd').toUpperCase();
            const availableDay = availabilityConfiguration.availabilities.find(value => value.dayOfWeek == threeLetterDay);
            if (!availableDay) continue;
            //Check if the time is available
            const monthDateReservations = instructorReservations.filter(r => monthDate.get("date") == r.fromDate.getDate() && monthDate.get("date") == r.toDate.getDate());
            if (monthDateReservations?.length <= 0) {
                result.push(new AvailabilityResponseDto(formatDate(monthDate.toDate()), availableDay.timeFrom, availableDay.timeTo));
                continue;
            }
            const timeFrom = moment(availableDay.timeFrom, "HH:mm:ss");
            const availableDayStartTime = monthDate
                .utc(true)
                .hour(timeFrom.get('hour'))
                .minutes(timeFrom.get('minutes'))
                .seconds(timeFrom.get('seconds'))
                .clone();

            const timeTo = moment(availableDay.timeTo, "HH:mm:ss");
            const availableDayEndTime = monthDate
                .hour(timeTo.get('hour'))
                .minutes(timeTo.get('minutes'))
                .seconds(timeTo.get('seconds'))
                .utc()
                .clone();
            const availableDayTimeRange = moment.range(availableDayStartTime, availableDayEndTime);

            let availableTimeRanges = [availableDayTimeRange];
            for (const reservation of monthDateReservations) {
                const reservationRange = moment.range(reservation.fromDate, reservation.toDate);
                availableTimeRanges = availableTimeRanges.flatMap(range => range.subtract(reservationRange));
            }
            for (const availableTimeRange of availableTimeRanges) {
                result.push({
                    date: monthDate.format("YYYY-MM-DD"),
                    from: formatTime(availableTimeRange.start.utc().toDate()),
                    to: formatTime(availableTimeRange.end.utc().toDate()),
                })
            }

        }
        return result;
    }

    async book(instructorId: number, dto: BookingRequestDto) {
        const {studentId, date, to, from} = dto;
        const fromDate = moment(`${date} ${from}`, 'YYYY-MM-DD HH:mm').toDate();
        const toDate = moment(`${date} ${to}`, 'YYYY-MM-DD HH:mm').toDate();
        //TODO: check if the time slot available
        await this.instructorRepository.book(instructorId, studentId, fromDate, toDate)
    }

    private _getDaysArrayByMonth(month: string): moment.Moment[] {
        const momentMonthObject = moment(month, 'YYYY-MM');
        const startOfMonth = moment(momentMonthObject).startOf('month');
        const endOfMonth = moment(momentMonthObject).endOf('month');
        const range = moment().range(startOfMonth, endOfMonth);
        return [...range.by('days')];
    }
}