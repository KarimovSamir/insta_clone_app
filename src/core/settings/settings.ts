export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/instaCloneApp',
  DB_NAME: process.env.DB_NAME || 'instaCloneApp',
  AC_SECRET: process.env.AC_SECRET || 'gkflgkfkgjdlfgjvf',
  AC_TIME: Number(process.env.AC_TIME) || 3600,

  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  MAIL_FROM: process.env.MAIL_FROM || 'No Reply <no-reply@ydigitalhome.me>',
  FRONTEND_CONFIRM_URL: process.env.FRONTEND_CONFIRM_URL || 'https://insta-clone-app-kappa.vercel.app/registration-confirmation',
  APP_BASE_URL: process.env.APP_BASE_URL || 'https://insta-clone-app-kappa.vercel.app',
};
