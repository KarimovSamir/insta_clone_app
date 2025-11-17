const path = require('path');
const dotenv = require('dotenv');

// подхватываем .env.test для e2e
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
