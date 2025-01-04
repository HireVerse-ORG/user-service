import { Request, Response } from 'express';
import { inject, injectable } from "inversify";
import BaseController from "../../core/base.controller";
import { IOtpService } from "./interfaces/otp.service.interface";
import TYPES from "../../core/container/container.types";
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { IUserService } from "../user/interfaces/user.service.interface";
import { INotificationService } from "../external/notification/notification.service.interface";
import { ITokenService } from "../external/token/token.service.interface";

@injectable()
export class OtpController extends BaseController {
  @inject(TYPES.OtpService) private otpService!: IOtpService;
  @inject(TYPES.UserService) private userService!: IUserService;
  @inject(TYPES.TokenService) private tokenService!: ITokenService; 
  @inject(TYPES.NotificationService) private notificationService!: INotificationService;
  

  /**
* @route POST /user/send-otp
* @scope Public
**/
  sendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.getUserByEmail(email);
    const otp = this.otpService.generateOtp();
    await this.otpService.saveOtp({ email: user.email }, otp.toString());
    try {
      const response = await this.notificationService.sendOtpEmail(email, otp.toString());
      return res.status(response.status).json(response.message);
    } catch (error: any) {
      return res.status(error.status).json(error.message);
    }
  });

  /**
* @route PUT /user/verify-otp
* @scope Public
**/
  verifyOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const status = await this.otpService.verifyOtp({ email, otp });
    if (!status) {
      return res.status(400).json({
        message: "Invalid or expired otp",
      });
    }
    const user = await this.userService.verifyUser(email);
    const token = this.tokenService.generateUserToken(user);
    res.json({user, token});
  });
}