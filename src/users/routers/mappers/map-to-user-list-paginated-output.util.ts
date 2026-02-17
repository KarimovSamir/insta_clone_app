import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { UserListPaginatedOutput } from "../output/user-list-paginated.output";

export function mapToUserListPaginatedOutput(
    users: WithId<User>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
    return {
        pagesCount: meta.pageSize
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map((user) => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        })),
    };
}
