import {Container} from "inversify";
import {DatabaseConnection} from "../database";
import {Logger} from "./logger.config";
import {IUserRepository} from "../repositories/auth/user.repository";
import {UserPrismaRepository} from "../repositories/auth/user.prisma.repository";
import {AccessTokenStrategy} from "../middelware/strategy/access-token.strategy";
import {AuthService} from "../services/auth.service";
import {IRefreshTokenRepository} from "../repositories/auth/refresh-token.repository";
import {RefreshTokenPrismaRepository} from "../repositories/auth/refresh-token.prisma.repository";

export const container = new Container();
container.bind(Logger).toSelf();
container.bind(DatabaseConnection).toSelf();
container.bind(AccessTokenStrategy).toSelf();
container.bind(IUserRepository).to(UserPrismaRepository);
container.bind(IRefreshTokenRepository).to(RefreshTokenPrismaRepository);
container.bind(AuthService).toSelf();