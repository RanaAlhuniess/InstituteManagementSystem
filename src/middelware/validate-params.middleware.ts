import { NextFunction, Request, Response } from 'express';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import { validate } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { ValidationException } from '../config';

export function validateParams(
  dto: ClassConstructor<any>,
  skipMissingProperties = false
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dto, req.query);
    const errors = await validate(dtoObj, { skipMissingProperties });
    if (errors.length > 0) {
      const errorMessages = errors.reduce((acc, error) => {
        const constraints = Object.values(error.constraints || {});
        return acc.concat(constraints);
      }, [] as string[]);

      return next(new ValidationException(errorMessages.join(', ')));
    }

    sanitize(dtoObj);
    req.query = dtoObj;
    next();
  };
}
