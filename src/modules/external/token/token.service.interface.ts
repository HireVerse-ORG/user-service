import { UserPayload } from "@hireverse/service-common/dist/token/user/userPayload";
import { UserDto } from "../../user/dto/user.dto";

export interface ITokenService {
    generateUserToken(pyload: UserDto): string;
    generateRefreshToken(pyload: UserDto): string;
    verifyRefreshToken(token: string): UserPayload;
    generateResetPasswordToken(payload: { userid: string }): string;
    verifyResetPasswordToken(token: string): { userid: string };
}