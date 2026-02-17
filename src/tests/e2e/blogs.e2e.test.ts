import request from "supertest";
import { createTestApp, closeTestApp } from "./_bootstrap";
import { basicAuthHeader, clearDb } from "./_helpers";

let app: any;

describe("E2E: /blogs", () => {
    // Выполняется в начале. Поднимаем приложение
    beforeAll(async () => {
        app = await createTestApp();
    });

    // Выполняется в конце для завершения тестов
    afterAll(async () => {
        await closeTestApp();
    });

    // Перед каждым тестом чистим базу
    beforeEach(async () => {
        await clearDb(app);
    });

    // Добавление блога
    describe("POST /blogs", () => {
        // Тестируем отсутствие авторизации
        it("401 when no basic auth", async () => {
            await request(app)
                .post("/blogs")
                .send({
                    name: "A",
                    description: "B",
                    websiteUrl: "https://example.com",
                })
                .expect(401);
        });

        // Тестируем валидацию
        it("400 when invalid input", async () => {
            await request(app)
                .post("/blogs")
                .set("Authorization", basicAuthHeader())
                .send({ name: "", description: "B", websiteUrl: "not-a-url" })
                .expect(400)
                .then(({ body }) => {
                    expect(Array.isArray(body.errorsMessages)).toBe(true);
                });
        });

        // Тестируем, когда всё правильно
        it("201 when valid input; returns normalized blog", async () => {
            const payload = {
                name: "My Blog",
                description: "About testing",
                websiteUrl: "https://example.com",
            };

            const res = await request(app)
                .post("/blogs")
                .set("Authorization", basicAuthHeader())
                .send(payload)
                .expect(201);

            // Ожидаем именно такую форму ответа
            expect(res.body).toEqual({
                id: expect.any(String),
                name: payload.name,
                description: payload.description,
                websiteUrl: payload.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean),
            });
        });
    });

    // Удаление блога
    describe("DELETE /blogs/:id", () => {
        // Тестируем отсутствие авторизации
        it("401 without basic auth", async () => {
            await request(app).delete("/blogs/any-id").expect(401);
        });

        // Если нет блога
        it("404 when blog not found", async () => {
            await request(app)
                .delete("/blogs/aaaaaaaaaaaaaaaaaaaaaaaa")
                .set("Authorization", basicAuthHeader())
                .expect(404);
        });

        // Успешное удаление
        it("204 when blog deleted; then 404 on second delete", async () => {
            // Создадим блог для удаления
            const createRes = await request(app)
                .post("/blogs")
                .set("Authorization", basicAuthHeader())
                .send({
                    name: "To be deleted",
                    description: "temp",
                    websiteUrl: "https://example.com",
                })
                .expect(201);

            const blogId = createRes.body.id;

            // Удаляем блог
            await request(app)
                .delete(`/blogs/${blogId}`)
                .set("Authorization", basicAuthHeader())
                .expect(204);

            // Повторное удаление чтобы была ошибка 404
            await request(app)
                .delete(`/blogs/${blogId}`)
                .set("Authorization", basicAuthHeader())
                .expect(404);
        });
    });
});
