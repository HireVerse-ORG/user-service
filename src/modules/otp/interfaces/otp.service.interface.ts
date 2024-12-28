import { GenerateOtpDto, VerifyOtpDto, OtpResponseDto  } from "../dto/otp.dto";

export interface IOtpService {
  generateOtp(): number;
  saveOtp(dto: GenerateOtpDto, otp: string): Promise<void>;
  generateAndSaveOtp(dto: GenerateOtpDto): Promise<string>;
  verifyOtp(dto: VerifyOtpDto): Promise<boolean>;
}
