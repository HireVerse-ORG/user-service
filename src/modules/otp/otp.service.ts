import crypto from "node:crypto";
import { IOtpService } from "./interfaces/otp.service.interface";
import { inject, injectable } from "inversify";
import { IOtpRepository } from "./interfaces/otp.repository";
import TYPES from "../../core/types";
import { GenerateOtpDto, VerifyOtpDto } from "./dto/otp.dto";
import { NotFoundError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class OtpService implements IOtpService {
    @inject(TYPES.OtpRepository) private otpRepo!: IOtpRepository;

    public generateOtp(): number {
        const otp = crypto.randomInt(100000, 999999);
        return otp
    }

    public async saveOtp(dto: GenerateOtpDto, otp: string): Promise<void> {
        await this.otpRepo.create({ email: dto.email, otp })
    }

    public async generateAndSaveOtp(dto: GenerateOtpDto): Promise<string> {
        const otp = this.generateOtp();

        const existingOtp = await this.otpRepo.findByEmail(dto.email);
        if(existingOtp){
            existingOtp.otp = otp.toString();
            await existingOtp.save()
            return "Otp Created"
        }

        await this.saveOtp(dto, otp.toString())
        return "Otp Created"
    }

    public async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
        const otpRecord = await this.otpRepo.findByEmail(dto.email)
        if (!otpRecord) {
            throw new NotFoundError("Inavild or expired otp");
        }
        const isOtpValid = await otpRecord.verifyOtp(dto.otp);
        return isOtpValid;
    }
}