import {Container} from "inversify";
import {DatabaseConnection} from "../database";
import {Logger} from "./logger.config";

export const container = new Container();
container.bind(Logger).toSelf();
container.bind(DatabaseConnection).toSelf();
