import { Router, Request, Response } from "express";
import { db } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/types/http-statuses";

export const testingRouter = Router();

testingRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send('testing url');
});

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.blogs = [];
    res.sendStatus(HttpStatus.NoContent);
});