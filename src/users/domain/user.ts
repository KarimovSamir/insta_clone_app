// Это доменная модель: тип, которым мы оперируюм внутри приложения (сервисы, бизнес-логика).

export type User = {
    login: string,
    passwordHash: string,
    email: string,
    createdAt: string
};
