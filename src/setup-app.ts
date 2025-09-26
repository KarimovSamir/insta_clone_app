import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { blogRouter } from './blogs/routers/blogs.router';
import { postRouter } from './posts/routers/posts.router';
import { TESTING_PATH, BLOGS_PATH, POSTS_PATH} from './core/paths/paths';

export const setupApp = async (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    // app.get("/", (req, res) => {
    //     res.status(200).send("Instagram clone app");
    // });

    app.use(BLOGS_PATH, blogRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(TESTING_PATH, testingRouter);

    return app;
};