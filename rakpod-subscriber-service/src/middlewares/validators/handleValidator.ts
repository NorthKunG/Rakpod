import * as express from 'express';
import { validationResult } from "express-validator"

export const handleValidator = () => {
  return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    next();
  };
};

