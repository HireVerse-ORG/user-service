import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import ExpressServer from './app/express';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';
import Database from './core/databse';

(async () => {
    checkEnvVariables('DATABASE_URL', 'JWT_SECRET_KEY', 'NOTIFICATION_SERVICE_URL', 'CLIENT_ORIGIN');
    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5001';

    const db = new Database(databaseUrl);
    db.connect();
    
    const expressServer = new ExpressServer();
    expressServer.start(expressPort);

    process.on('SIGINT', async () => {
        expressServer.stop()
        db.disconnect();
    });
    process.on("SIGTERM", () => {
        expressServer.stop()
        db.disconnect();
    });
})();