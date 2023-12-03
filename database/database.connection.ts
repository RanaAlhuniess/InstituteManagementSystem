import {inject, injectable} from 'inversify';
import {Sequelize} from 'sequelize';
import {Logger} from "../config";

@injectable()
export class DatabaseConnection {
    private sequelize: Sequelize;

    constructor(@inject(Logger) private readonly logger: Logger) {
        this.sequelize = new Sequelize({
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: "postgres",
            host: process.env.DB_HOST,
            dialectOptions: {
                port: process.env.DB_PORT,
                operatorsAliases: false,
            }

        });
    }

    public async initConnection(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.logger.info('Connection to the database has been established successfully.');
        } catch (error: any) {
            this.logger.error('Unable to connect to the database:', error);
        }
    }

    public getSequelizeInstance(): Sequelize {
        return this.sequelize;
    }

    public async disconnect(): Promise<void> {
        await this.sequelize.close();
        this.logger.info('Connection to the database has been closed.');
    }
}
