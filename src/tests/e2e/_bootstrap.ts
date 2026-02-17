import express from "express";
import { setupApp } from "../../setup-app";
import { runDB, stopDb } from "../../db/mongo.db";
import { SETTINGS } from "../../core/settings/settings";

export async function createTestApp() {
    const app = express();
    await setupApp(app);
    await runDB(SETTINGS.MONGO_URL);
    return app;
}

export async function closeTestApp() {
    await stopDb();
}
