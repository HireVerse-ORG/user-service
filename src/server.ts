import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import ExpressServer from './app/express';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';
import Database from './core/databse';
import { startEventService, stopEventService } from './app/events';

(async () => {
    checkEnvVariables('DATABASE_URL', 'JWT_SECRET_KEY', 'NOTIFICATION_SERVICE_URL', 'PROFILE_SERVICE_URL', 'PAYMENT_SERVICE_URL', 'KAFKA_SERVER');
    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5001';

    const db = new Database(databaseUrl);
    db.connect();
    
    const expressServer = new ExpressServer();
    expressServer.start(expressPort);
    startEventService()

    process.on('SIGINT', async () => {
        expressServer.stop()
        db.disconnect();
        stopEventService();
    });
    process.on("SIGTERM", () => {
        expressServer.stop()
        db.disconnect();
        stopEventService();
    });
})();