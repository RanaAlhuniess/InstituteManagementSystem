import {UserRole} from "../entities/user-role.value";
import {NextFunction, Request, Response} from "express";
import {UserEntity} from "../entities/user.entity";
import {UnauthorizedException} from "../config";

export function authorize(...userRoles: UserRole[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const user = req['user'] as UserEntity;
        if (!user || !userRoles.includes(user.roleId)) return next(new UnauthorizedException('You are not allowed to access this resource'))
        next();
    }
}