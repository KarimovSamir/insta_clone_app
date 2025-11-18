// Это доменная модель: тип, которым мы оперируюм внутри приложения (сервисы, бизнес-логика).

export type EmailConfirmation = {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
};

export type MailPasswordRecovery = {
    recoveryCode: string,
    expirationDate: string
};

export type User = {
    login: string,
    passwordHash: string,
    email: string,
    createdAt: string,
    emailConfirmation?: EmailConfirmation,
    mailPasswordRecovery?: MailPasswordRecovery
};
