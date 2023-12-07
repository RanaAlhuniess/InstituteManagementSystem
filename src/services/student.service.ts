import {inject, injectable} from "inversify";
import {Logger} from "../config";
import {IStudentRepository} from "../repositories/student/student.repository";

@injectable()
export class StudentService {
    constructor(@inject(IStudentRepository) private readonly studentRepository: IStudentRepository,
                @inject(Logger) private readonly logger: Logger) {
    }

    getStudentSessions(studentId: number) {
        return this.studentRepository.getSessions(studentId);
    }
}