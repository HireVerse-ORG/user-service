import { Router } from "express";
import { UserController } from "./user.controller";
import TYPES from '../../core/types';
import { usercontainer } from "./user.module";

const router = Router();
const userController = usercontainer.get<UserController>(TYPES.UserController)

router.post("/", (req, res) => userController.create(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.get("/:id", (req, res) => userController.getUser(req, res));

export const userRoutes = router;
