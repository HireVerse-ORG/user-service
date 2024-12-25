import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    verifyOtp(userOtp: string): Promise<boolean>;
}


const otpSchema = new mongoose.Schema<IOTP>(
    {
        email: { type: String, required: true, trim: true, lowercase: true },
        otp: { type: String, required: true },
        createdAt: { type: Date, default: Date.now, expires: 120 }, // TTL index for automatic expiration
    }
);

// Hash the OTP before saving
otpSchema.pre<IOTP>("save", async function (next) {
    if (!this.isModified("otp")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (err) {
        next(err as any);
    }
});

otpSchema.methods.verifyOtp = async function (userOtp: string): Promise<boolean> {
    try {
        return await bcrypt.compare(userOtp, this.otp);
    } catch (err) {
        throw new Error("Error verifying OTP");
    }
};

const Otp = mongoose.model<IOTP>("OTP", otpSchema);
export default Otp

