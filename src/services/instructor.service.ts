import {inject, injectable} from "inversify";
import {Logger} from "../config";
import {IInstructorRepository} from "../repositories/instructor/instructor.repository";
import moment, {Moment} from "moment";
import {AvailabilityResponseDto} from "../dtos/instructor/availability.response.dto";

@injectable()
export class InstructorService {
    constructor(@inject(IInstructorRepository) private readonly instructorRepository: IInstructorRepository, @inject(Logger) private readonly logger: Logger) {
    }

    async getInstructorAvailability(instructorId: number, month: string) {
        const monthDates = this._getDaysArrayByMonth(month);
        const startDate = moment(monthDates[0]).toDate();
        const endDate = moment(monthDates[monthDates.length - 1]).toDate();

        const availabilityConfiguration = await this.instructorRepository.getAvailability(instructorId, startDate, endDate);
        const result: AvailabilityResponseDto[] = [];
        for (let monthDate of monthDates) {
           const monthDateMoment = moment(monthDate);
            //Check if the day is available
            const threeLetterDay = monthDateMoment.format('ddd').toUpperCase();
            const availableDay = availabilityConfiguration.availabilities.find(value => value.dayOfWeek == threeLetterDay);
            if (!availableDay) continue;
            //Check if the time is available
            result.push(new AvailabilityResponseDto(
                monthDateMoment,
                availableDay.timeFrom,
                availableDay.timeTo
            ));
        }
        return result;
    }

    async bookSpecificSlot(studentId: number, instructorId: number, dayOfWeek: string, startTime: string, endTime: string) {
        // check if this slot available
        // yes: book
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