import {UserEntity} from "../../entities/user.entity";

export abstract class IUserRepository {
    abstract create(item: Omit<UserEntity,'id'>): Promise<UserEntity>;

    abstract findById(id: number): Promise<UserEntity>;

    abstract findUserByEmail(email: string): Promise<UserEntity>;
}