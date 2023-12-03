import {inject, injectable} from 'inversify';
import {Logger} from "../config";

@injectable()
export class DatabaseConnection {

    constructor(@inject(Logger) private readonly logger: Logger) {

    }

    public async initConnection(): Promise<void> {
        try {
            this.logger.info('Connection to the database has been established successfully.');
        } catch (error: any) {
            this.logger.error('Unable to connect to the database:', error);
        }
    }


    public async disconnect(): Promise<void> {
        this.logger.info('Connection to the database has been closed.');
    }
}
