import express, { Application } from 'express';
import morgan from 'morgan';

export function registerMiddlewares(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));
}