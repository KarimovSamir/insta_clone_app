import express, { Express } from "express";
import { testingRouter } from "./testing/routers/testing.router";
import { blogRouter } from "./blogs/routers/blogs.router";
import { postRouter } from "./posts/routers/posts.router";
import { userRouter } from "./users/routers/users.router";
import { authRouter } from "./auth/routers/auth.router";
import { commentRouter } from "./comments/routers/comments.router";
import { deviceSessionsRouter } from "./device_sessions/routers/device-sessions.router";
import {
    TESTING_PATH,
    BLOGS_PATH,
    POSTS_PATH,
    USERS_PATH,
    AUTH_PATH,
    COMMENTS_PATH,
    DEVICE_SESSIONS_PATH,
} from "./core/paths/paths";
import cookieParser from "cookie-parser";

export const setupApp = async (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса
    app.use(cookieParser());

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Instagram clone app");
    });

    app.use(BLOGS_PATH, blogRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(USERS_PATH, userRouter);
    app.use(AUTH_PATH, authRouter);
    app.use(COMMENTS_PATH, commentRouter);
    app.use(TESTING_PATH, testingRouter);
    app.use(DEVICE_SESSIONS_PATH, deviceSessionsRouter);

    return app;
};
