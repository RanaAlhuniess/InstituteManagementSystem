import {BaseHttpController, controller, httpPost, requestBody,} from 'inversify-express-utils';
import {inject} from 'inversify';
import {AuthService} from "../services/auth.service";
import {RegisterRequestDto} from "../dtos/auth/register.request.dto";
import {validateBody} from "../middelware";
import {SigninRequestDto} from "../dtos/auth/signin.request.dto";

@controller('/auth')
export class AuthController extends BaseHttpController {
    constructor(@inject(AuthService) private readonly authService: AuthService) {
        super();
    }

    @httpPost('/register', validateBody(RegisterRequestDto))
    register(@requestBody() dto: RegisterRequestDto) {
        return this.authService.register(dto);

    }

    @httpPost('/signin', validateBody(SigninRequestDto))
    signin(@requestBody() dto: SigninRequestDto) {
        return this.authService.signin(dto);
    }
}
