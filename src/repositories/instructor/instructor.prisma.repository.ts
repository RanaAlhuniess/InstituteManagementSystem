import {inject, injectable} from "inversify";
import {IInstructorRepository} from "./instructor.repository";
import {PrismaClient} from "@prisma/client";
import {DatabaseConnection} from "../../database";
import {InstructorEntity} from "../../entities/instructor.entity";
import {InstructorAvailabilityEntity} from "../../entities/instructor-availability.entity";

@injectable()

export class InstructorPrismaRepository implements IInstructorRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async getAvailability(instructorId: number): Promise<InstructorEntity> {
        const instructor = await this.prismaClient.instructor.findUnique({
            where: {id: instructorId},
            include: {availabilities: true}
        });
        return this.dbItemToEntity(instructor);
    }


    private dbItemToEntity(item: any): InstructorEntity {
        const instructor = {
            id: item.id,
            email: item.email,
            title: item.title,
            firstName: item.firstName,
            lastName: item.lastName,
            gender: item.gender,
            teachingSince: item.teachingSince,
            availabilities: [],
        } as InstructorEntity;

        // Convert the database availability objects to InstructorAvailabilityEntity instances
        if (item.availabilities) {
            instructor.availabilities = item.availabilities.map((availability: any) => {
                return new InstructorAvailabilityEntity(
                    availability.id,
                    availability.dayOfWeek,
                    availability.timeFrom,
                    availability.timeTo,
                    availability.activeFrom,
                    availability.activeTo,
                );
            });
        }
        return instructor;
    }
}