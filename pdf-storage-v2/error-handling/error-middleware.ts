import {Request, Response} from 'express';
import { createLogger } from 'winston';

const logger = createLogger();

const errorHandler = (err: Error, req: Request, res: Response, next: Function) => {

    logger.error(err.message, err);

    if (res.headersSent) {
        return next(err)
    }

    if (res.statusCode === 200) {
        res.status(500);
    }

    res.send({
        error: err.message,
    });
};

export { errorHandler };