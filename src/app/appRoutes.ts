import { Application } from "express";
import { userRoutes } from "../modules/user/user.routes";

export function registerRoutes(app:Application, prefix="/api/user") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("User Server is healthy 🚀")
    })
    app.use(`${prefix}`, userRoutes);
}