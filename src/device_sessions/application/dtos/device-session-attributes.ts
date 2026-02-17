// Аттрибуты это то, что мы принимаем в запросах

export type DeviceSessionAttributes = {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    lastActiveDate: string;
    exp: string;
};
