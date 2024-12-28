export interface GenerateOtpDto {
    email: string;
}

export interface VerifyOtpDto {
    email: string; 
    otp: string;  
}

export interface OtpResponseDto {
    message: string;
    success: boolean;
}
