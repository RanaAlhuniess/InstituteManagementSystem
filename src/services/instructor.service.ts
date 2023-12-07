import {inject, injectable} from "inversify";
import {Logger} from "../config";
import {IInstructorRepository} from "../repositories/instructor/instructor.repository";
import moment, {Moment} from "moment";
import {AvailabilityResponseDto} from "../dtos/instructor/availability.response.dto";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";

@injectable()
export class InstructorService {
    constructor(@inject(IInstructorRepository) private readonly instructorRepository: IInstructorRepository, @inject(Logger) private readonly logger: Logger) {
    }

    async getInstructorAvailability(instructorId: number, month: string) {
        const monthDates = this._getDaysArrayByMonth(month);
        const startDate = moment(monthDates[0]).toDate();
        const endDate = moment(monthDates[monthDates.length - 1]).toDate();

        const availabilityConfiguration = await this.instructorRepository.getAvailability(instructorId, startDate, endDate);
        const instructorReservations = await this.instructorRepository.getReservations(instructorId, startDate, endDate);

        const result: AvailabilityResponseDto[] = [];
        for (let monthDate of monthDates) {
            const monthDateMoment = moment(monthDate);

            //Check if the day is available
            const threeLetterDay = monthDateMoment.format('ddd').toUpperCase();
            const availableDay = availabilityConfiguration.availabilities.find(value => value.dayOfWeek == threeLetterDay);
            if (!availableDay) continue;


            //Check if the time is available
            const monthDateReservations = instructorReservations.filter(r=>monthDateMoment.toDate().getDate() == r.fromDate.getDate() && monthDateMoment.toDate().getDate() == r.toDate.getDate() );
            if(monthDateReservations?.length <= 0) {
                result.push(new AvailabilityResponseDto(monthDateMoment, availableDay.timeFrom, availableDay.timeTo));
                continue;
            }
            for (const reservation of monthDateReservations) {

            }

        }
        return result;
    }

    async book(instructorId: number, dto: BookingRequestDto) {
        // check if this slot available
        // yes: book
        const {studentId, date, to, from} = dto;
        const fromDate = moment(`${date} ${from}`, 'YYYY-MM-DD HH:mm').toDate();
        const toDate = moment(`${date} ${to}`, 'YYYY-MM-DD HH:mm').toDate();
        await this.instructorRepository.book(instructorId, studentId, fromDate, toDate)
    }

    private _getDaysArrayByMonth(month: string): string[] {
        const momentMonthObject = moment(month, 'YYYY-MM');
        let daysInMonth = momentMonthObject.daysInMonth();
        const arrDays = [];

        while (daysInMonth) {
            const current = momentMonthObject.date(daysInMonth).format();
            arrDays.push(current);
            daysInMonth--;
        }
        return arrDays;
    }
}