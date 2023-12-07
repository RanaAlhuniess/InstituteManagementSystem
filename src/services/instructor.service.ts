import {inject, injectable} from "inversify";
import {IUserRepository} from "../repositories/auth/user.repository";
import {IRefreshTokenRepository} from "../repositories/auth/refresh-token.repository";
import {Logger} from "../config";
import {IInstructorRepository} from "../repositories/instructor/instructor.repository";

@injectable()
export class InstructorService {
    constructor(
        @inject(IInstructorRepository) private readonly instructorRepository: IInstructorRepository,
        @inject(Logger) private readonly logger: Logger
    ) {
    }

    getInstructorAvailability(instructorId: number) {
        const instructor = this.instructorRepository.getAvailability(instructorId);
        return instructor;
    }
}