import {InstructorEntity} from "../../entities/instructor.entity";
import {ReservationEntity} from "../../entities/reservation.entity";
import {PaginatedInstructorsEntity} from "../../entities/paginated.instructors.entity";

export abstract class IInstructorRepository {
    abstract getAvailability(instructorId: number, startDate: Date, endDate: Date): Promise<InstructorEntity>;
    abstract getReservations(instructorId: number, startDate: Date, endDate: Date): Promise<ReservationEntity[]>;
    abstract book(instructorId: number, studentId: number, fromDate: Date, toDate: Date) : Promise<void>;

    abstract findMany(pageSize: number, currentPage: number): Promise<PaginatedInstructorsEntity>;
}