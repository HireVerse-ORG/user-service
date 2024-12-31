import { Router } from "express";
import { UserController } from "./user.controller";
import TYPES from '../../core/container/container.types';
import {isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { container } from "../../core/container";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController)

router.get("/", isAuthenticated, userController.getUser);

router.post("/login", userController.login);
router.post("/register", userController.create);

router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

export const userRoutes = router;
