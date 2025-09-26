// import express from "express";
// import { setupApp } from "./setup-app";
// import { SETTINGS } from './core/settings/settings';
// import { runDB } from './db/mongo.db';

// const bootstrap = async () => {
//   const app = express();
//   setupApp(app);
//   const PORT = SETTINGS.PORT;

//   await runDB(SETTINGS.MONGO_URL);

//   return app;
// };

// bootstrap();

import express from "express";
import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import { SETTINGS } from "./core/settings/settings";

const app = express();

// настройка роутов
setupApp(app);

// подключение к базе с ленивым клиентом (один раз на холодный старт)
runDB(SETTINGS.MONGO_URL).catch((err) => {
  console.error("❌ DB connection failed:", err);
});

// экспортируем app для Vercel
export default app;
