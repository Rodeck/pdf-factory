import { Request } from 'express';

const userId = "user1234";

const getUser = (request: Request<any>) => {
    return userId;
}

export { getUser }