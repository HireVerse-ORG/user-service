import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
    ADMIN = "admin",
    SEEKER = "seeker",
    COMPANY = "company",
}

export interface IUser extends Document {
    id: string;
    fullname: string;
    email: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        fullname: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true},
        role: {
            type: String,
            enum: [UserRole.ADMIN, UserRole.SEEKER, UserRole.COMPANY],
            default: UserRole.SEEKER,
        },
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true } 
);

userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
