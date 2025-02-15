import { Router } from "express";
import { UserController } from "./user.controller";
import TYPES from '../../core/container/container.types';
import {allowedRoles, isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { container } from "../../core/container";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController)

// baseurl: 
router.get("/", isAuthenticated, userController.getUser);

router.post("/login", userController.login);
router.post("/register", userController.create);
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.post("/refresh-token", userController.refresToken);

router.post("/auth/microsoft", userController.microsoftSignIn);
router.post("/auth/google", userController.googleSignIn);

// admin routes
router.get('/list', allowedRoles('admin'), userController.listUsers);
router.get('/list/companies', allowedRoles('admin'), userController.listCompanies);
router.put('/block-user', allowedRoles('admin'), userController.toggleUserBlockStatus);
router.get('/statistics', allowedRoles('admin'), userController.getUserStatistics);

export const userRoutes = router;
