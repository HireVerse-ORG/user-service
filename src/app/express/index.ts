import 'reflect-metadata';
import express, { Application } from 'express';
import { registerRoutes } from './appRoutes';
import { registerMiddlewares } from './appMiddlewares';
import { logger } from '../../core/utils/logger';
import Database from '../../core/databse';

class Server {
    public app: Application;
    private server: any;
    private database: Database;

    constructor(private dbUrl: string) {
        this.app = express();
        this.database = new Database(dbUrl); 
        this.initialize();
    }

    async initialize() {
        try {
            await this.database.connect(); 
            registerMiddlewares(this.app);
            registerRoutes(this.app);

            process.on("SIGINT", this.shutdown.bind(this));
            process.on("SIGTERM", this.shutdown.bind(this));
        } catch (error) {
            logger.error("Error during initialization:", error);
            process.exit(1);
        }
    }

    start(PORT: string) {
        this.server = this.app.listen(PORT, () => {
            logger.info(`User server running at PORT:${PORT}`);
        });
    }

    private async shutdown() {
        logger.info("Shutting down User Server...");
        try {
            this.server?.close(() => {
                logger.info("User Server shut down gracefully.");
            });

            await this.database.disconnect();

            process.exit(0);
        } catch (error) {
            logger.error("Error during shutdown:", error);
            process.exit(1);
        }
    }
}

export default Server;