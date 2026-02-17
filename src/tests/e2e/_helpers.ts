import request from "supertest";
import type { Express } from "express";
import { SETTINGS } from "../../core/settings/settings";

export function basicAuthHeader() {
    const login = SETTINGS.ADMIN_LOGIN;
    const pass = SETTINGS.ADMIN_PASSWORD;
    const base64 = Buffer.from(`${login}:${pass}`).toString("base64");
    return `Basic ${base64}`;
}

export async function clearDb(app: Express) {
    await request(app).delete("/testing/all-data");
}
