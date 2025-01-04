import { ITokenService } from "./token.service.interface";
import { resettokenService, tokenService } from "../../../core/utils/token";
import { injectable } from "inversify";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { UserDto } from "../../user/dto/user.dto";

@injectable()
export class TokenService implements ITokenService {
    generateUserToken(payload: UserDto): string {
        return tokenService.generateToken({
            userId: payload.id,
            role: payload.role,
            isVerified: payload.isVerified,
            isBlocked: payload.isBlocked,
        }, '15m');
    }
    
    generateRefreshToken(payload: UserDto): string {
        return tokenService.generateToken({
            userId: payload.id,
            role: payload.role,
            isVerified: payload.isVerified,
            isBlocked: payload.isBlocked,
        }, '7d');
    }

    verifyRefreshToken(token: string) {
        try {
           return tokenService.verifyToken(token);
        } catch (error) {
            throw new BadRequestError("Invalid or expired token")
        }
    }

    generateResetPasswordToken(payload: { userid: string; }): string {
        return resettokenService.generateToken(payload, '5m');
    }

    verifyResetPasswordToken(token: string): { userid: string; } {
        try {
            return resettokenService.verifyToken(token);
        } catch (error) {
            throw new BadRequestError("Invalid or expired token")
        }
    }
}