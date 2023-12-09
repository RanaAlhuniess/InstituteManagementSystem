import {inject, injectable} from "inversify";
import {BadRequestException, formatDate, formatTime, Logger} from "../config";
import {IInstructorRepository} from "../repositories/instructor/instructor.repository";
import {AvailabilityResponseDto} from "../dtos/instructor/availability.response.dto";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";
import {DateRange, extendMoment} from 'moment-range';
import {InstructorAvailabilityEntity} from "../entities/instructor-availability.entity";
import {ReservationEntity} from "../entities/reservation.entity";

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
            const availableDay = this._getAvailableDay(monthDate.toISOString(), availabilityConfiguration.availabilities);
            if (!availableDay) continue;

            //Check if the time is available
            const monthDateReservations = instructorReservations.filter(r =>
                monthDate.get("date") == r.fromDate.getDate()
                && monthDate.get("date") == r.toDate.getDate());
            if (monthDateReservations?.length <= 0) {
                result.push(new AvailabilityResponseDto(formatDate(monthDate.toDate()), availableDay.timeFrom, availableDay.timeTo));
                continue;
            }

            const availableDayTimeRange = this._getAvailableDayRange(availableDay, monthDate);

            const availableTimeRanges = this._subtractReservationsFromAvailableRange(availableDayTimeRange, instructorReservations)
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
        const availabilityConfiguration = await this.instructorRepository.getAvailability(instructorId, fromDate, toDate);
        const availableDay = this._getAvailableDay(date, availabilityConfiguration.availabilities);
        if (!availableDay)
            throw new BadRequestException('not available');

        const instructorReservations = await this.instructorRepository.getReservations(instructorId, fromDate, toDate);
        const bookingRange = moment.range(fromDate, toDate);
        for (const reservation of instructorReservations) {
            const reservationRange = moment.range(reservation.fromDate, reservation.toDate);
            if (bookingRange.overlaps(reservationRange))
                throw new BadRequestException('overlaps');
        }

        await this.instructorRepository.book(instructorId, studentId, fromDate, toDate)
    }

    private _getAvailableDayRange(availableDay: InstructorAvailabilityEntity, monthDate: moment.Moment) {
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
        return moment.range(availableDayStartTime, availableDayEndTime);
    }

    private _getAvailableDay(date: string, availabilities: InstructorAvailabilityEntity[]) {
        const threeLetterDay = moment(date).format('ddd').toUpperCase();
        return availabilities.find(value => value.dayOfWeek == threeLetterDay);
    }

    private _getDaysArrayByMonth(month: string): moment.Moment[] {
        const momentMonthObject = moment(month, 'YYYY-MM');
        const startOfMonth = moment(momentMonthObject).startOf('month');
        const endOfMonth = moment(momentMonthObject).endOf('month');
        const range = moment().range(startOfMonth, endOfMonth);
        return [...range.by('days')];
    }

    private _subtractReservationsFromAvailableRange(availableDayTimeRange: DateRange, reservations: ReservationEntity[]) {
        let result = [availableDayTimeRange];
        for (const reservation of reservations) {
            const reservationRange = moment.range(reservation.fromDate, reservation.toDate);

            result = result.flatMap(range => range.subtract(reservationRange));
        }
        return result;
    }
}