import {BaseHttpController, controller, httpGet, httpPost, request} from "inversify-express-utils";
import passport from "passport";
import { Request } from 'express';
import {inject} from "inversify";
import {InstructorService} from "../services/instructor.service";
import {UserRole} from "../entities/user-role.value";
import {authorize} from "../middelware/authorize.middleware";
import {validateParams} from "../middelware/validate-params.middleware";
import {AvailabilityRequestDto} from "../dtos/instructor/availability.request.dto";
import {queryParam, requestParam} from "inversify-express-utils/lib/decorators";

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

    @httpPost('/:id/book', passport.authenticate('access-jwt', { session: false }))
    async bookInstructorAvailability(@request() req: Request) {
        const instructorId = parseInt(req.params.id);
        const { studentId, dayOfWeek, startTime, endTime } = req.body;

        // Logic to check if the selected slot is within the instructor's available range for the specific day
        return this.instructorService.bookSpecificSlot(studentId, instructorId, dayOfWeek, startTime, endTime);
    }
}