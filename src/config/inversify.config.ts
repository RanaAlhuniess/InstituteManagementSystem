import {Container} from "inversify";
import {DatabaseConnection} from "../database";
import {Logger} from "./logger.config";
import {IUserRepository} from "../repositories/auth/iUser.repository";
import {UserPrismaRepository} from "../repositories/auth/user.prisma.repository";
import {AccessTokenStrategy} from "../middelware/strategy/access-token.strategy";

export const container = new Container();
container.bind(Logger).toSelf();
container.bind(DatabaseConnection).toSelf();
container.bind(AccessTokenStrategy).toSelf();
container.bind(IUserRepository).to(UserPrismaRepository);