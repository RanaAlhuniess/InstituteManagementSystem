import {IStudentRepository} from "./student.repository";
import {PrismaClient} from "@prisma/client";
import {inject, injectable} from "inversify";
import {DatabaseConnection} from "../../database";
import {SessionEntity} from "../../entities/session.entity";
import {formatDateTime} from "../../config";

@injectable()
export class StudentPrismaRepository implements IStudentRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async getSessions(studentId: number) {
        const sessions = await this.prismaClient.studentReservations.findMany({
            where: {
                studentId: studentId,
            },
            select: {
                from: true,
                to: true,
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return sessions.map(session => this._dbItemToEntity(session));
    }

    private _dbItemToEntity(item: any): SessionEntity {
        return {
            from: formatDateTime(item.from),
            to: formatDateTime(item.to),
            instructor: {firstName: item.instructor.firstName, lastName: item.instructor.lastName}
        } as SessionEntity;
    }
}