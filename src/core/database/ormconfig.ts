import { DataSource } from "typeorm";
import { logger } from "../utils/logger";

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    // logging: true,
    entities: ["src/**/*.entity.ts"],
    migrations: [],
    subscribers: [],
});

export const connectDb = async () => {
    try {
        await AppDataSource.initialize();
        
        logger.info(`Database connected to: ${process.env.DATABASE_URL}`);
    } catch (error) {
        console.log(error);
        logger.error(`Error connecting to database: ${error}`);
        process.exit(1);
    }
}

export const closeDb = async () => {
    await AppDataSource.destroy();
    logger.warn('Database connection closed');
}