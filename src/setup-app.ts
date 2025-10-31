// import express, { Express } from 'express';
// import { testingRouter } from './testing/routers/testing.router';
// import { blogRouter } from './blogs/routers/blogs.router';
// import { postRouter } from './posts/routers/posts.router';
// import { TESTING_PATH, BLOGS_PATH, POSTS_PATH} from './core/paths/paths';

// export const setupApp = async (app: Express) => {
//     app.use(express.json()); // middleware для парсинга JSON в теле запроса

//     // основной роут
//     app.get("/", (req, res) => {
//         res.status(200).send("Instagram clone app");
//     });

//     app.use(BLOGS_PATH, blogRouter);
//     app.use(POSTS_PATH, postRouter);
//     app.use(TESTING_PATH, testingRouter);

//     return app;
// };

import express, { Express } from "express";
import { testingRouter } from "./testing/routers/testing.router";
import { blogRouter } from "./blogs/routers/blogs.router";
import { postRouter } from "./posts/routers/posts.router";
import { TESTING_PATH, BLOGS_PATH, POSTS_PATH, USERS_PATH, AUTH_PATH, COMMENTS_PATH } from "./core/paths/paths";
import { dbReady } from "./db/mongo.db";
import { userRouter } from "./users/routers/users.router";
import { authRouter } from "./auth/routers/auth.router";
import { commentRouter } from "./comments/routers/comments.router";
import cookieParser from 'cookie-parser';

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());

  // не ждём БД
  app.get("/", (req, res) => {
    res.status(200).send("Instagram clone app");
  });

  // Все прочие запросы дождутся готовности БД
  app.use(async (req, res, next) => {
    try {
      if (dbReady) await dbReady;
      next();
    } catch (e) {
      console.error("DB init error:", e);
      res.status(500).send("Internal Server Error");
    }
  });

  app.use(AUTH_PATH, authRouter);
  app.use(BLOGS_PATH, blogRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(USERS_PATH, userRouter);
  app.use(COMMENTS_PATH, commentRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};

