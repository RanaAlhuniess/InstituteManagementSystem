import {inject, injectable} from "inversify";
import {IInstructorRepository} from "./instructor.repository";
import {Prisma, PrismaClient} from "@prisma/client";
import {DatabaseConnection} from "../../database";
import {InstructorEntity} from "../../entities/instructor.entity";
import {InstructorAvailabilityEntity} from "../../entities/instructor-availability.entity";
import {InternalServerException, NotFoundException} from "../../config";
import {ReservationEntity} from "../../entities/reservation.entity";

@injectable()

export class InstructorPrismaRepository implements IInstructorRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async getAvailability(instructorId: number, startDate: Date, endDate: Date): Promise<InstructorEntity> {

        let whereCondition: any = {id: instructorId};
        // console.log(startDate.toISOString())
        //  if (startDate && endDate) {
        //      whereCondition.availabilities = {
        //          some: {
        //              AND: [
        //                  {
        //                      activeFrom: {
        //                          gte: new Date(startDate), // Convert to Date object
        //                      },
        //                  },
        //                  {
        //                      activeTo: {
        //                          lte: new Date(endDate), // Convert to Date object
        //                      },
        //                  },
        //              ],
        //          },
        //      };
        //  }
        try {
            const instructor = await this.prismaClient.instructor.findUniqueOrThrow({
                where: whereCondition, include: {availabilities: true}
            });
            return this.dbItemToEntity(instructor);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Instructor not found');
            }
            throw new InternalServerException('Internal Server Error');
        }

    }


    async book(instructorId: number, studentId: number, fromDate: Date, toDate: Date): Promise<void> {
        const dbResult = await this.prismaClient.studentReservations.create({
            data: {
                studentId: studentId, instructorId: instructorId, from: fromDate, to: toDate
            }
        });
    }

    async getReservations(instructorId: number, startDate: Date, endDate: Date): Promise<ReservationEntity[]> {
        const dbReservations = await this.prismaClient.studentReservations.findMany({
            where: {
                instructorId: instructorId
            }
        });
        return dbReservations.map(r => this._dbReservationToEntity(r));
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
                return new InstructorAvailabilityEntity(availability.id, availability.dayOfWeek, availability.timeFrom, availability.timeTo, availability.activeFrom, availability.activeTo,);
            });
        }
        return instructor;
    }


    private _dbReservationToEntity(dbItem: any): ReservationEntity {
        return {
            id: dbItem.id,
            instructorId: dbItem.instructorId,
            studentId: dbItem.studentId,
            fromDate: dbItem.from,
            toDate: dbItem.to
        };
    }
}