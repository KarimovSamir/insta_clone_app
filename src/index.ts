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
app.set('trust proxy', true);
setupApp(app);

runDB(SETTINGS.MONGO_URL).catch((err) => {
  console.error("❌ DB connection failed:", err);
});

// Для Vercel нужен именно экспорт приложения
export default app;