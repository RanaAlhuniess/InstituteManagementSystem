import {BaseHttpController, controller, httpGet, httpPost, request, requestBody} from "inversify-express-utils";
import passport from "passport";
import {inject} from "inversify";
import {InstructorService} from "../services/instructor.service";
import {UserRole} from "../entities/user-role.value";
import {authorize} from "../middelware/authorize.middleware";
import {validateParams} from "../middelware/validate-params.middleware";
import {AvailabilityRequestDto} from "../dtos/instructor/availability.request.dto";
import {queryParam, requestParam} from "inversify-express-utils/lib/decorators";
import {BookingRequestDto} from "../dtos/instructor/booking.request.dto";
import {validateBody} from "../middelware";
import {PaginationDTO} from "../dtos/instructor/pagination.request.dto";

@controller('/instructors')
export class InstructorController extends BaseHttpController {
    constructor(@inject(InstructorService) private readonly instructorService: InstructorService) {
        super();
    }

    @httpGet('/:id/availability',
        validateParams(AvailabilityRequestDto),
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT)
    )
    getInstructorAvailability(@requestParam('id') id, @queryParam() dto: AvailabilityRequestDto) {
        const instructorId = parseInt(id);
        const month = dto.month;
        return this.instructorService.getInstructorAvailability(instructorId, month)
    }

    @httpPost('/:id/book',
        passport.authenticate('access-jwt', {session: false}),
        validateBody(BookingRequestDto)
    )
    async bookInstructorAvailability(@requestParam('id') id, @requestBody() dto: BookingRequestDto) {
        const instructorId = parseInt(id);
        await this.instructorService.book(instructorId, dto);
    }

    @httpGet('/',
        validateParams(PaginationDTO),
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT)
    )
    getInstructors(@queryParam() dto: PaginationDTO) {
        return this.instructorService.getAll(dto)
    }
}