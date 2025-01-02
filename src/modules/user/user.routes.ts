import { Router } from "express";
import { UserController } from "./user.controller";
import TYPES from '../../core/container/container.types';
import {allowedRoles, isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { container } from "../../core/container";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController)

router.get("/", isAuthenticated, userController.getUser);

router.post("/login", userController.login);
router.post("/register", userController.create);
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

router.post("/auth/microsoft", userController.microsoftSignIn);
router.post("/auth/google", userController.googleSignIn);

// admin routes
router.get('/list', allowedRoles('admin'), userController.listUsers)
router.put('/block-user', allowedRoles('admin'), userController.toggleUserBlockStatus)

export const userRoutes = router;
