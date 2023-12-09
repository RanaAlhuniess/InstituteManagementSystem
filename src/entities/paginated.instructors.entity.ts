import {InstructorEntity} from "./instructor.entity";

export interface PaginatedInstructorsEntity{
    data: InstructorEntity[];
    total: number;
    currentPage: number;
}
