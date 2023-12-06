export type JwtConfig = {
    secret: string;
    expiresIn: string;
};

export type Payload = {
    sub: string;
    email: string;

    roleId: number;
};
export const accessTokenConfig: JwtConfig = {
    secret: process.env.ACCESS_TOKEN_SECRET || ((): never => {
        throw new Error('ACCESS_TOKEN_SECRET not defined in environment variables');
    })(),
    expiresIn: '10m',
};

export const refreshTokenConfig: JwtConfig = {
    secret: process.env.REFRESH_TOKEN_SECRET  || ((): never => {
        throw new Error('REFRESH_TOKEN_SECRET not defined in environment variables');
    })(),
    expiresIn: '60d',
};
