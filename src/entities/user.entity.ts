export class UserEntity {
    id: number;
    email: string;
    password: string;
    roleId: number;

    profileId?: number;
}