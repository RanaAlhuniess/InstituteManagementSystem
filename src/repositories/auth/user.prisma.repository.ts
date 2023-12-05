import {inject, injectable} from "inversify";
import {IUserRepository} from "./iUser.repository";
import {UserEntity} from "../../entities/user.entity";
import {DatabaseConnection} from "../../database";
import {PrismaClient} from "@prisma/client";

@injectable()

export class UserPrismaRepository implements IUserRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async create(user: UserEntity): Promise<UserEntity> {
        const dbResult = await this.prismaClient.user.create({
            data: {
                email: user.email,
                name: user.username,
            }
        });
        return this.dbItemToEntity(dbResult);
    }

    async findById(id: number): Promise<UserEntity> {
        const dbResult = await this.prismaClient.user.findUnique({
            where: {
                id: id,
            },
        })
        return this.dbItemToEntity(dbResult);
    }

    private dbItemToEntity(item: any): UserEntity {
        return {
            email: item.email,
            username: item.name
        } as UserEntity;
    }

}