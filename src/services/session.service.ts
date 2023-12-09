import {inject, injectable} from "inversify";
import {ISessionRepository} from "../repositories/session/session.repository";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";
import {InstructorService} from "./instructor.service";
import {DatabaseConnection} from "../database";
import {PrismaClient} from "@prisma/client";

@injectable()
export class SessionService {
    private prismaClient: PrismaClient;

    constructor(@inject(ISessionRepository) private readonly sessionRepository: ISessionRepository,
                @inject(InstructorService) private readonly instructorService: InstructorService,
                @inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async deleteSession(sessionId: number, userProfileId: number): Promise<void> {
        await this.sessionRepository.delete(sessionId, userProfileId);
    }

    async updateSession(sessionId: number, userProfileId: number, dto: BookingRequestDto) {
        const {instructorId} = dto;
        //TODO: refactor transaction
        const transaction = this.prismaClient.$transaction;
        try {
            await this.sessionRepository.delete(sessionId, userProfileId);
            await this.instructorService.book(instructorId, dto);
            await this.prismaClient.$queryRaw`COMMIT`;
        } catch (error) {
            await this.prismaClient.$queryRaw`ROLLBACK`;
            throw error;
        }

    }
}