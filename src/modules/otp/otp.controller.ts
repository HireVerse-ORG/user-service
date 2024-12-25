import { inject, injectable } from "inversify";
import BaseController from "../../core/base.controller";
import { IOtpService } from "./interfaces/otp.service.interface";
import TYPES from "../../core/types";

@injectable()
class OtpController extends BaseController {
    @inject(TYPES.OtpService) private otpService!: IOtpService;
  
}