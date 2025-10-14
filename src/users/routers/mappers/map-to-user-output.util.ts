import { WithId } from "mongodb";
import { UserOutput } from "../output/user-output";
import { User } from "../../domain/user";

export function mapToUserOutput(user: WithId<User>): UserOutput {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}