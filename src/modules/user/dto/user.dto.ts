import { UserRole } from "../user.entity";

export interface UserCreateDto {
    email: string;
    password: string;
    role: UserRole;
}

export interface UserValidateDto {
    email: string;
    password: string;
}

export interface UserUpdateDto {
    email?: string;
    role?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
}

export interface UserDto {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    connectionCount: number;
    createdAt: Date;
    updatedAt: Date;
}