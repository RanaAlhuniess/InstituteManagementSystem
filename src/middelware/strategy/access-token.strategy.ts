import {inject, injectable} from 'inversify';
import passport from 'passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {IUserRepository} from "../../repositories/auth/user.repository";
import {accessTokenConfig, Payload} from "../../config";

@injectable()
export class AccessTokenStrategy {
    constructor(
        @inject(IUserRepository) private readonly userRepository: IUserRepository
    ) {
    }

    public init() {
        passport.use(
            'access-jwt',
            new Strategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: accessTokenConfig.secret,
                },
                async (payload: Payload, done: VerifiedCallback) => {
                    const user = await this.userRepository.findById(Number(payload.sub));

                    if (!user) {
                        return done(null, false);
                    }

                    return done(null, user);
                }
            )
        );
    }
}
