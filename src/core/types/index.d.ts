import { ObjectId } from "mongodb";

declare global {
    namespace Express {
        interface Locals {
            currentUser?: {
                _id: ObjectId;
                login: string;
                email: string;
                createdAt: string;
            };
        }
    }
}

export {};
