import { UserRole } from "../user.entity";

export interface UserCreateDto {
    fullname: string;
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
    role?: UserRole;
    isVerified?: boolean;
    isBlocked?: boolean;
}

export interface UserDto {
    id: string;
    fullname: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isBlocked: boolean;
}