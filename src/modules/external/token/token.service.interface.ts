import { UserDto } from "../../user/dto/user.dto";

export interface ITokenService {
    generateUserToken(pyload: UserDto): string;
    generateResetPasswordToken(payload: { userid: string }): string;
    verifyResetPasswordToken(token: string): { userid: string };
}