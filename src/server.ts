import dotenv from 'dotenv';
dotenv.config();

import Server from './app/express';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';

(async () => {
    checkEnvVariables('DATABASE_URL', 'JWT_SECRET_KEY', 'NOTIFICATION_SERVICE_URL', 'CLIENT_ORIGIN');
    const server = new Server(process.env.DATABASE_URL!);
    const port = process.env.PORT || '5001';
    server.start(port);
})();