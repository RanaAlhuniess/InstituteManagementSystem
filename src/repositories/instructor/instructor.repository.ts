import {InstructorEntity} from "../../entities/instructor.entity";

export abstract class IInstructorRepository {
    abstract getAvailability(instructorId: number): Promise<InstructorEntity>;
}