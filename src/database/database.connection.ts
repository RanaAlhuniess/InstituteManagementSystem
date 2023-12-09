import {inject, injectable} from 'inversify';
import {Logger} from "../config";
import {PrismaClient} from "@prisma/client";
import {createSoftDeleteMiddleware} from "prisma-soft-delete-middleware";

@injectable()
export class DatabaseConnection {

    private readonly prisma: PrismaClient;

    constructor(@inject(Logger) private readonly logger: Logger) {
        this.prisma = new PrismaClient();
        this.prisma.$use(
            createSoftDeleteMiddleware({
                models: {
                    StudentReservations: true,
                },
                defaultConfig: {
                    field: "deleted",
                    createValue: Boolean,
                    allowToOneUpdates: true,
                    allowCompoundUniqueIndexWhere: true,
                },
            }))
    }

    public getDBInstance(): PrismaClient {
        return this.prisma;
    }

    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
        this.logger.info('Connection to the database has been closed.');
    }
}
