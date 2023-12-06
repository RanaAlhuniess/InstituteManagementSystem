import {inject, injectable} from 'inversify';
import {RegisterRequestDto} from "../dtos/auth/register.request.dto";
import {IUserRepository} from "../repositories/auth/user.repository";
import * as argon from 'argon2';
import {TokenResponseDto} from "../dtos/auth/token.response.dto";
import {SigninRequestDto} from "../dtos/auth/signin.request.dto";
import jwt from 'jsonwebtoken';
import {
    accessTokenConfig,
    JwtConfig,
    Logger,
    NotFoundException,
    Payload,
    refreshTokenConfig,
    UnauthorizedException
} from "../config";
import {IRefreshTokenRepository} from "../repositories/auth/refresh-token.repository";

@injectable()
export class AuthService {
    constructor(
        @inject(IUserRepository) private readonly userRepository: IUserRepository,
        @inject(IRefreshTokenRepository) private readonly refreshTokenRepository: IRefreshTokenRepository,
        @inject(Logger) private readonly logger: Logger
    ) {
    }

    async register(dto: RegisterRequestDto) {
        dto.password = await argon.hash(dto.password);
        const user = await this.userRepository.create(dto);

        const payload: Payload = {
            sub: String(user.id),
            email: user.email,
            roleId: user.roleId
        };
        const accessToken = this.generateJWT(payload, accessTokenConfig);
        const refreshToken = this.generateJWT(payload, refreshTokenConfig);

        await this.refreshTokenRepository.create({
            userId: user.id,
            token: refreshToken,
        });
        return this.generateTokenResponse(accessToken, refreshToken);
    }


    async signin(dto: SigninRequestDto): Promise<{
        access_token: string;
        refresh_token: string;
    }> {
        try {
            const user = await this.userRepository.findUserByEmail(dto.email);

            if (!user)
                throw new NotFoundException('User not found');

            const checkPassword = await argon.verify(user.password, dto.password);

            if (!checkPassword)
                throw new UnauthorizedException('Invalid password');
            const payload: Payload = {
                sub: String(user.id),
                email: user.email,
                roleId: user.roleId
            };
            const accessToken = this.generateJWT(payload, accessTokenConfig);
            const refreshToken = this.generateJWT(payload, refreshTokenConfig);

            const tokenObject = await this.refreshTokenRepository.findByUserId(user.id);
            if (tokenObject) {
                await this.refreshTokenRepository.findByIdAndUpdate(tokenObject.id, {
                    token: refreshToken,
                });
            } else {
                await this.refreshTokenRepository.create({
                    userId: user.id,
                    token: refreshToken,
                });
            }
            return this.generateTokenResponse(accessToken, refreshToken);
        } catch (e: any) {
            throw new Error(e.message);
        }

    }

    async signout(userId: number): Promise<void> {
        return await this.refreshTokenRepository.findByUserIdAndDelete(userId);
    }
    generateJWT(payload: Payload, config: JwtConfig): string {
        return jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
        });
    }

    private generateTokenResponse(
        accessToken: string,
        refreshToken: string
    ): TokenResponseDto {
        return {
            access_token: accessToken ,
            refresh_token: refreshToken ,
        };
    }
}
