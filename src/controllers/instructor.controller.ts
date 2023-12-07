import {BaseHttpController, controller, httpGet, request} from "inversify-express-utils";
import passport from "passport";
import { Request } from 'express';
import {inject} from "inversify";
import {InstructorService} from "../services/instructor.service";
import {UserRole} from "../entities/user-role.value";
import {authorize} from "../middelware/authorize.middleware";

@controller('/instructors')
export class InstructorController extends BaseHttpController {
    constructor(@inject(InstructorService) private readonly instructorService: InstructorService) {
        super();
    }
    @httpGet('/:id/availability',
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT)
    )
    getInstructorAvailability(@request() req: Request) {
        const instructorId = parseInt(req.params.id);
        return this.instructorService.getInstructorAvailability(instructorId)
    }
}