import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import express, { Application } from 'express';
import { registerRoutes } from './appRoutes';
import { registerMiddlewares } from './appMiddlewares';
import { closeDb, connectDb } from '../core/database/ormconfig';
import { logger } from '../core/utils/logger';

class Server {
    public app: Application;
    private server: any;

    constructor() {
        this.app = express();
        this.initialize();
    }

    async initialize() {
        await connectDb();
        registerMiddlewares(this.app);
        registerRoutes(this.app);
        process.on('SIGINT', this.shutdown.bind(this));
        process.on('SIGTERM', this.shutdown.bind(this));
    }

    start(PORT: string) {
        this.server = this.app.listen(PORT, () => {
            logger.info(`User server running at PORT:${PORT}`);
        });
    }

    private async shutdown() {
        logger.info('Shutting down User Server...');
        try {
            closeDb();
            this.server?.close(() => {
                logger.info('User Server shut down gracefully.');
                process.exit(0);
            });
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    }
}


export default Server