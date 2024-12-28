import { Application } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { otpRoutes } from "../modules/otp/otp.routes";
import { errorHandler, notFoundHandler } from "./errorHandler";

export function registerRoutes(app:Application, prefix="/api/user") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("User Server is healthy 🚀")
    })
    app.use(`${prefix}`, userRoutes);
    app.use(`${prefix}`, otpRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);
}