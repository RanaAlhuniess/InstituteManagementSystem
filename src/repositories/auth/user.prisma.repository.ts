import {inject, injectable} from "inversify";
import {IUserRepository} from "./user.repository";
import {UserEntity} from "../../entities/user.entity";
import {DatabaseConnection} from "../../database";
import {PrismaClient} from "@prisma/client";
import {ForbiddenException, UnauthorizedException} from "../../config";
import {UserRole} from "../../entities/user-role.value";

@injectable()

export class UserPrismaRepository implements IUserRepository {
    private prismaClient: PrismaClient;

    constructor(@inject(DatabaseConnection) private readonly database: DatabaseConnection) {
        this.prismaClient = this.database.getDBInstance();
    }

    async create(user: UserEntity): Promise<UserEntity> {
        try {
            const dbResult = await this.prismaClient.user.create({
                data: {
                    email: user.email,
                    password: user.password,
                    roleId: user.roleId
                }
            });
            return this.dbItemToEntity(dbResult);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ForbiddenException(`Email ${user.email} is already in use`);
            }
            throw error;
        }

    }

    async findById(id: number): Promise<UserEntity> {
        const dbResult = await this.prismaClient.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                roleId: true,
                email: true,
                password: true,
                instructor: {
                    select: {
                        id: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        return this.dbItemToEntity(dbResult);
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        const dbResult = await this.prismaClient.user.findUnique({
            where: {
                email: email,
            },
        })
        if (!dbResult)
            throw new UnauthorizedException('Unauthorized');
        return this.dbItemToEntity(dbResult);
    }

    private dbItemToEntity(item: any): UserEntity {
        const profileId = (item?.roleId == UserRole.STUDENT)
            ? item.student?.id
            : item.instructor?.id;
        return {
            id: item.id,
            email: item.email,
            password: item.password,
            roleId: item.roleId,
            profileId: profileId
        } as UserEntity;
    }

}