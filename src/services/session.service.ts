import {inject, injectable} from "inversify";
import {Logger} from "../config";
import {IStudentRepository} from "../repositories/student/student.repository";
import {ISessionRepository} from "../repositories/session/session.repository";

@injectable()
export class SessionService {
    constructor(@inject(ISessionRepository) private readonly sessionRepository: ISessionRepository,
                @inject(Logger) private readonly logger: Logger) {
    }

    async deleteSession(sessionId: number, userProfileId: number): Promise<void> {
        await this.sessionRepository.delete(sessionId, userProfileId);
    }
}