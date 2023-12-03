import { injectable } from 'inversify';
import winston, {createLogger, LogCallback, transports} from 'winston';


@injectable()
export class Logger {
    private logger = createLogger({
        level: 'debug',
        transports: [new transports.Console({
            format: winston.format.simple(),
        })],
    });

    public info(message: any, callback?: LogCallback) {
        this.logger.info(message, callback);
    }

    public warn(message: any, callback?: LogCallback) {
        this.logger.warn(message, callback);
    }

    public error(message: any, callback?: LogCallback) {
        this.logger.error(message, callback);
    }

    public debug(message: any, callback?: LogCallback) {
        this.logger.debug(message, callback);
    }
}
