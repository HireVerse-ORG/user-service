import { Router } from "express";
import { UserController } from "./user.controller";
import TYPES from '../../core/types';
import { container } from "../../core/inversify";
import {isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController)


router.get("/", isAuthenticated, userController.getUser);

router.post("/login", userController.login);
router.post("/register", userController.create);

export const userRoutes = router;
