import {InstructorEntity} from "../../entities/instructor.entity";
import {ReservationEntity} from "../../entities/reservation.entity";

export abstract class IInstructorRepository {
    abstract getAvailability(instructorId: number, startDate: Date, endDate: Date): Promise<InstructorEntity>;
    abstract getReservations(instructorId: number, startDate: Date, endDate: Date): Promise<ReservationEntity[]>;
    abstract book(instructorId: number, studentId: number, fromDate: Date, toDate: Date) : Promise<void>;
}