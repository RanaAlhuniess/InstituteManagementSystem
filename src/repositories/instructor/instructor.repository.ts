import {InstructorEntity} from "../../entities/instructor.entity";

export abstract class IInstructorRepository {
    abstract getAvailability(instructorId: number, startDate: Date, endDate: Date): Promise<InstructorEntity>;
}