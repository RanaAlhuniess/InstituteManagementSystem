import {UserEntity} from "../../entities/user.entity";

export abstract class IUserRepository {
    abstract create(item: UserEntity): Promise<UserEntity>;

    abstract findById(id: number): Promise<UserEntity>;
}