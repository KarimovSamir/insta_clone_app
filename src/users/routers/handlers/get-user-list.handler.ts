import { Request, RequestHandler, Response } from 'express'
import { HttpStatus } from "../../../core/types/http-statuses";
import { matchedData } from "express-validator";
import { UserQueryInput } from "../input/user-query.input";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { usersService } from "../../application/users.service";
import { mapToUserListPaginatedOutput } from "../mappers/map-to-user-list-paginated-output.util";

export const getUserListHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        // после валидации приводим тип к нашему инпуту
        const sanitizedQuery = matchedData(req, {
            locations: ['query'],
            includeOptionals: true,
        }) as UserQueryInput;
        //утилита для извечения трансформированных значений после валидатара
        //в req.query остаются сырые квери параметры (строки)

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
        const {items, totalCount} = await usersService.findUsers(queryInput);

        const usersListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(usersListOutput);
    } catch (e) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
};