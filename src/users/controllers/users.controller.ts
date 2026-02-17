import { inject, injectable } from "inversify";
import { RequestHandler } from "express";
import { matchedData } from "express-validator";
import { TYPES } from "../../core/ioc/types";
import { HttpStatus } from "../../core/types/http-statuses";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { RepositoryBadRequestError } from "../../core/errors/repository-bad-request.error";
import { UsersService } from "../application/users.service";
import { mapToUserListPaginatedOutput } from "../routers/mappers/map-to-user-list-paginated-output.util";
import { mapToUserOutput } from "../routers/mappers/map-to-user-output.util";
import { UserCreateInput } from "../routers/input/user-create.input";
import { UserQueryInput } from "../routers/input/user-query.input";

@injectable()
export class UsersController {
    constructor(
        @inject(TYPES.UsersService)
        private readonly usersService: UsersService,
    ) {}

    getUserList: RequestHandler = async (req, res) => {
        try {
            const sanitizedQuery = matchedData(req, {
                locations: ["query"],
                includeOptionals: true,
            }) as UserQueryInput;

            const queryInput =
                setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
            const { items, totalCount } =
                await this.usersService.findUsers(queryInput);

            const usersListOutput = mapToUserListPaginatedOutput(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });

            res.send(usersListOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    createUser: RequestHandler<unknown, unknown, UserCreateInput> = async (
        req,
        res,
    ) => {
        try {
            const createdUserId = await this.usersService.createUser(req.body);
            const createdUser =
                await this.usersService.findUserByIdOrFail(createdUserId);
            const userOutput = mapToUserOutput(createdUser);

            res.status(HttpStatus.Created).send(userOutput);
        } catch (error) {
            if (error instanceof RepositoryBadRequestError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [
                        {
                            message: error.message,
                            field: error.field ?? "",
                        },
                    ],
                });
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    deleteUserById: RequestHandler<{ id: string }> = async (req, res) => {
        try {
            await this.usersService.deleteUserById(req.params.id);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };
}
