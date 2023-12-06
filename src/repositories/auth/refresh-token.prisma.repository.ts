import {inject, injectable} from 'inversify';
import {ForbiddenException} from '../../config';
import {PrismaClient} from "@prisma/client";
import {DatabaseConnection} from "../../database";
import {RefreshTokenEntity} from "../../entities/refresh-token.entity";
import {IRefreshTokenRepository} from "./refresh-token.repository";

@injectable()
export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async create(refreshToken: RefreshTokenEntity): Promise<void> {
        try {
            const newRefreshToken = await this.prismaClient.refreshToken.create({
                data: {
                    hashedToken: refreshToken.token,
                    userId: refreshToken.userId
                }
            });

        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ForbiddenException(
                    'A refresh token already exists for this user'
                );
            }

            throw error;
        }
    }

    async findByUserId(userId: number): Promise<RefreshTokenEntity | undefined> {
        const dbResult = await this.prismaClient.refreshToken.findFirst({
            where: {
                userId: userId,
            },
        });
        if (!dbResult) {
            return undefined;
        }
        return this.dbItemToEntity(dbResult);
    }

    async findByToken(token: string): Promise<RefreshTokenEntity> {
        const dbResult = await this.prismaClient.refreshToken.findFirstOrThrow({
            where: {
                hashedToken: token
            },
        });
        return this.dbItemToEntity(dbResult);
    }

    async findByIdAndUpdate(
        id: number,
        patch: Partial<RefreshTokenEntity>
    ): Promise<void> {
        const updateData = {
            hashedToken: patch.token
        }
        await this.prismaClient.refreshToken.update({
            where: {
                id: id,
            },
            data: updateData,
        });
    }

    async findByUserIdAndDelete(userId: number): Promise<void> {

    }

    private dbItemToEntity(item: any): RefreshTokenEntity {
        return {
            id: item.id,
            userId: item.userId,
            token: item.hashedToken
        } as RefreshTokenEntity;
    }
}
