import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { UpdatePasswordDto, UserCreateDto, UserDto, UserValidateDto } from "../dto/user.dto";
import { UserRole } from "../user.entity";

export interface IUserService {
    validateUser(data: UserValidateDto): Promise<UserDto>;
    createUser(data: UserCreateDto): Promise<UserDto>;
    verifyUser(email: string): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    getUserByEmail(email: string): Promise<UserDto>;
    getUsersByRole(role: string, page?: number, limit?:number, query?: string): Promise<IPaginationResponse<UserDto>>;
    updatePassword(data: UpdatePasswordDto): Promise<string>;
    toggleBlockStatus(id: string, isBlocked: boolean): Promise<string>;
    verifyMicrosoftUser(accessToken: string, role: UserRole): Promise<{created: boolean, user: UserDto}>;
    verifyGoogleUser(accessToken: string, role: UserRole): Promise<{created: boolean, user: UserDto}>;
    setRefreshToken(id: string, token: string): Promise<string>;
    getRefreshToken(id: string): Promise<string>;
    getUserStatistics(): Promise<{
        total: number;
        monthlyGrowth: Array<{ month: string; count: number }>;
    }>
}