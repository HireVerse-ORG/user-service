import { UserCreateDto, UserDto, UserValidateDto } from "../dto/user.dto";

export interface IUserService {
    validateUser(data: UserValidateDto): Promise<{message: string, userId: string, role: string}>;
    createUser(data: UserCreateDto): Promise<{message: string, userId: string, role: string}>;
    getUserById(id: string): Promise<UserDto | null>;
}