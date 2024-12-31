import { Router } from "express";
import TYPES from '../../core/container/container.types';
import { OtpController } from "./otp.controller";
import { container } from "../../core/container";

const router = Router();
const otpController = container.get<OtpController>(TYPES.OtpController);

router.post('/send-otp', otpController.sendOtp);
router.put("/verify-otp", otpController.verifyOtp);

export const otpRoutes = router;