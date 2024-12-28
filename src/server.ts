import dotenv from 'dotenv';
dotenv.config();

import Server from './app';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';

(async () => {
    checkEnvVariables('DATABASE_URL', 'JWT_SECRET_KEY', 'NOTIFICATION_SERVICE_URL');
    const server = new Server(process.env.DATABASE_URL!);
    const port = process.env.PORT || '5001';
    server.start(port);
})();