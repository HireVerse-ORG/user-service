import { Application } from "express";
import { userRoutes } from "../modules/user/user.routes";

export function registerRoutes(app:Application) {
    app.use('/user', userRoutes);
}