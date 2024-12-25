import { IOtpService } from "./interfaces/otp.service.interface";
import { inject, injectable } from "inversify";
import { IOtpRepository } from "./interfaces/otp.repository";
import TYPES from "../../core/types";

@injectable()
class OtpService implements IOtpService {
    @inject(TYPES.OtpRepository) private otpRepo!: IOtpRepository;
    
}