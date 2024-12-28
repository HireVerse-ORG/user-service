import { inject, injectable } from "inversify";
import BaseController from "../../core/base.controller";
import { IOtpService } from "./interfaces/otp.service.interface";
import TYPES from "../../core/types";
import { Request, Response } from 'express';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import {mapGrpcErrorToHttpStatus} from '@hireverse/service-common/dist/utils/helper';
import { tokenService } from "../../core/utils/token";
import { IUserService } from "../user/interfaces/user.service.interface";
import { notificationClient } from "../../core/rpc/clients";
import otpTemplate from "../../core/utils/htmlTemplates/otpTemplate";

@injectable()
export class OtpController extends BaseController {
  @inject(TYPES.OtpService) private otpService!: IOtpService;
  @inject(TYPES.UserService) private userService!: IUserService;

  /**
* @route POST /user/send-otp
* @scope Public
**/
  sendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.getUserByEmail(email);
    const otp = this.otpService.generateOtp();
    await this.otpService.saveOtp({email: user.email}, otp.toString());
    const html = otpTemplate(otp.toString());
    notificationClient.SendMail({ to: user.email, subject: "Email Verification", html }, (error: any | null, response: any) => {
      if (error) {
        const status = mapGrpcErrorToHttpStatus(error);
        const message = error.details;
        return res.status(status).json({ message })
      }

      return res.json({ message: "Otp created sucessfully" });
    })
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
    const token = tokenService.generateToken({
      userId: user.id,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    })
    res.json({
      user,
      token
    });
  });
}