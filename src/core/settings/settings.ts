export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/instaCloneApp',
  DB_NAME: process.env.DB_NAME || 'instaCloneApp',
  AC_SECRET: process.env.AC_SECRET || 'gkflgkfkgjdlfgjvf',
  AC_TIME: Number(process.env.AC_TIME) || 3600,
};
