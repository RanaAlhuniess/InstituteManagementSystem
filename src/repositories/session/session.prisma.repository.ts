import {ISessionRepository} from "./session.repository";
import {inject, injectable} from "inversify";
import {PrismaClient} from "@prisma/client";
import {DatabaseConnection} from "../../database";
import {ForbiddenException, Logger} from "../../config";

@injectable()
export class SessionPrismaRepository implements ISessionRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async delete(id: number, profileId: number): Promise<void> {
        try {
            const dbResult = await this.prismaClient.studentReservations.deleteMany({
                where: {
                    AND: [
                        {id: id},
                        {
                            OR: [
                                {studentId: profileId},
                                {instructorId: profileId},
                            ]
                        }
                    ]

                },
            });
            if (dbResult.count == 0) {
                throw new ForbiddenException('You are not allowed to access this resource')
            }
        } catch (e) {
            throw new ForbiddenException('You are not allowed to access this resource')
        }

    }

}