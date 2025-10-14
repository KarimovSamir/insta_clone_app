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
import { TESTING_PATH, BLOGS_PATH, POSTS_PATH, USERS_PATH } from "./core/paths/paths";
import { dbReady } from "./db/mongo.db";
import { errorsHandler } from "./core/errors/errors.handler";
import { userRouter } from "./users/routers/users.router";

export const setupApp = (app: Express) => {
  app.use(express.json());

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

  app.use(BLOGS_PATH, blogRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(USERS_PATH, userRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(errorsHandler);

  return app;
};

