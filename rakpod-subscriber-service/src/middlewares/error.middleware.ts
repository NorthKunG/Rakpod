import * as express from 'express';

export function errorMiddleware(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    let { status = 500, message, data } = error;

    console.log(`[Error] ${error}`);

    // If status code is 500 - change the message to Intrnal server error
    message = status === 500 || !message ? 'Internal server error' : message;

    error = {
        type: 'error',
        status,
        message,
        ...(data) && data
    }

    res.status(status).send(error);
}

/*
{
    type: 'error',
    status: 404,
    message: 'Not Found'
    data: {...} // optional
}
*/