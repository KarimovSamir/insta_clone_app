export const SETTINGS = {
  ADMIN_LOGIN: 'admin',
  ADMIN_PASSWORD: 'qwerty',
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/instaCloneApp',
  DB_NAME: process.env.DB_NAME || 'instaCloneApp',
  // Access token
  AC_SECRET: process.env.AC_SECRET || 'gkflgkfkgjdlfgjvf',
  AC_TIME: Number(process.env.AC_TIME) || 10,
  // Refresh token
  RT_SECRET: process.env.RT_SECRET || 'hdyslbncywbq',
  RT_TIME: Number(process.env.RT_TIME) || 20,

  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  MAIL_FROM: process.env.MAIL_FROM || 'No Reply <no-reply@mydigitalhome.me>',
  FRONTEND_CONFIRM_URL: process.env.FRONTEND_CONFIRM_URL || 'https://insta-clone-app-kappa.vercel.app/registration-confirmation',
  FRONTEND_RECOVERY_CODE_URL: process.env.FRONTEND_RECOVERY_CODE_URL || 'https://insta-clone-app-kappa.vercel.app/password-recovery',
  APP_BASE_URL: process.env.APP_BASE_URL || 'https://insta-clone-app-kappa.vercel.app',
};
