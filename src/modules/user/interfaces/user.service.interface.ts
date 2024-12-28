import { UpdatePasswordDto, UserCreateDto, UserDto, UserValidateDto } from "../dto/user.dto";

export interface IUserService {
    validateUser(data: UserValidateDto): Promise<UserDto>;
    createUser(data: UserCreateDto): Promise<UserDto>;
    verifyUser(email: string): Promise<UserDto>;
    getUserById(id: string): Promise<UserDto>;
    getUserByEmail(email: string): Promise<UserDto>;
    updatePassword(data: UpdatePasswordDto): Promise<string>;
}