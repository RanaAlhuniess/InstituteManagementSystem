import {BaseHttpController, controller, httpGet} from "inversify-express-utils";
import passport from "passport";
import {inject} from "inversify";
import {UserRole} from "../entities/user-role.value";
import {authorize} from "../middelware/authorize.middleware";
import {requestParam} from "inversify-express-utils/lib/decorators";
import {StudentService} from "../services/student.service";

@controller('/students')
export class StudentController extends BaseHttpController {
    constructor(@inject(StudentService) private readonly studentService: StudentService) {
        super();
    }

    @httpGet('/:id/sessions',
        passport.authenticate('access-jwt', {session: false}),
        authorize(UserRole.STUDENT)
    )
    getStudentSessions(@requestParam('id') id) {
        const studentId = parseInt(id);
        return this.studentService.getStudentSessions(studentId)
    }
}