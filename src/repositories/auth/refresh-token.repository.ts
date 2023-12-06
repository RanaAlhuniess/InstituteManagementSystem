import {RefreshTokenEntity} from "../../entities/refresh-token.entity";

export abstract class IRefreshTokenRepository {

    abstract create(refreshToken: Omit<RefreshTokenEntity,'id'>): Promise<void>;

    abstract findByUserId(userId: number): Promise<RefreshTokenEntity | undefined>;

    abstract findByToken(token: string): Promise<RefreshTokenEntity> ;

    abstract findByIdAndUpdate(
        userId: number,
        patch: Partial<RefreshTokenEntity>
    ): Promise<void> ;

    abstract findByUserIdAndDelete(userId: number): Promise<void>;
}
