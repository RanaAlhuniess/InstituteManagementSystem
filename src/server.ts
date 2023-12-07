import 'dotenv/config';
import 'reflect-metadata';
import {InversifyExpressServer} from "inversify-express-utils";
import {container, Logger, serverConfig, serverErrorConfig} from "./config";
import './controllers/index';

const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;


const handleSignal = (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server.`);
    process.exit();
};

process.on('SIGTERM', () => handleSignal('SIGTERM'));
process.on('SIGINT', () => handleSignal('SIGINT'));

export async function Bootstrap() {
    const server = new InversifyExpressServer(container);
    server.setConfig(serverConfig);
    server.setErrorConfig(serverErrorConfig);

    const app = server.build();
    app.listen(port, () =>
        new Logger().info(`Express Server initiated listening on port ${port}`)
    );
}

Bootstrap();
