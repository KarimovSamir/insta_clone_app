import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';
import { userCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';

export const bearerAuthGuard = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const token = auth.substring('Bearer '.length);
    const payload = await jwtService.verifyAccessToken(token); // { userId } | null
    if (!payload?.userId) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    try {
        const user = await userCollection.findOne({ _id: new ObjectId(payload.userId) });
        if (!user) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        res.locals.currentUser = user as any;
        return next();
    } catch {
        return res.sendStatus(HttpStatus.Unauthorized);
    }
};
