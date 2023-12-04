import {inject, injectable} from 'inversify';
import {Logger} from "../config";
import {PrismaClient} from "@prisma/client";

@injectable()
export class DatabaseConnection {

    private prisma: PrismaClient;

    constructor(@inject(Logger) private readonly logger: Logger) {
        this.prisma = new PrismaClient();
    }

    public async initConnection(): Promise<void> {
        try {
            this.logger.info('Connection to the database has been established successfully.');
        } catch (error: any) {
            this.logger.error('Unable to connect to the database:', error);
        }
    }


    public async disconnect(): Promise<void> {
        await this.prisma.disconnect();
        this.logger.info('Connection to the database has been closed.');
    }
}
