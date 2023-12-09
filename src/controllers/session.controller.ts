import {
    BaseHttpController,
    controller,
    httpDelete,
    httpPost,
    request,
    requestBody
} from "inversify-express-utils";
import passport from "passport";
import {inject} from "inversify";
import {UserRole} from "../entities/user-role.value";
import {authorize} from "../middelware/authorize.middleware";
import {requestParam} from "inversify-express-utils/lib/decorators";
import {SessionService} from "../services/session.service";
import {UserEntity} from "../entities/user.entity";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";
import {validateBody} from "../middelware";

@controller('/sessions')
export class SessionController extends BaseHttpController {
    constructor(@inject(SessionService) private readonly sessionService: SessionService) {
        super();
    }

    @httpDelete('/:id/cancel',
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT || UserRole.TEACHER)
    )
    deleteSession(@requestParam('id') id, @request() req: Request) {
        const sessionId = parseInt(id);
        const userProfileId = (req['user'] as UserEntity).profileId;
        return this.sessionService.deleteSession(sessionId, userProfileId);
    }

    @httpPost('/:id',
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT || UserRole.TEACHER),
        validateBody(BookingRequestDto)
    )
    updateSession(@requestParam('id') id,
                  @request() req: Request,
                  @requestBody() dto: BookingRequestDto) {
        const sessionId = parseInt(id);
        const userProfileId = (req['user'] as UserEntity).profileId;
        return this.sessionService.updateSession(sessionId, userProfileId, dto);
    }
}