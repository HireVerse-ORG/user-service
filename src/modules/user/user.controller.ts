import { Request, Response } from 'express';
import BaseController from "../../core/base.controller";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import { resettokenService, tokenService } from '../../core/utils/token';
import { notificationClient } from '../../core/rpc/clients';
import {mapGrpcErrorToHttpStatus} from '@hireverse/service-common/dist/utils/helper';
import resetPassTemplate from '../../core/utils/htmlTemplates/resetPassTemplate';

@injectable()
export class UserController extends BaseController {
    @inject(TYPES.UserService) private userService!: IUserService;

    /**
   * @route GET /user/login
   * @scope Public
   **/
    public login = asyncWrapper(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.userService.validateUser({ email, password });
        const token = tokenService.generateToken({
            userId: user.id,
            role: user.role,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
        })
        res.json({
            user,
            token
        });
    });

    /**
   * @route POST /user/register
   * @scope Public
   **/
    public create = asyncWrapper(async (req: Request, res: Response) => {
        const { fullname, email, password, role } = req.body;
        const user = await this.userService.createUser({ fullname, email, password, role });
        res.status(201).json({ user });
    })

    /**
   * @route POST /user
   * @scope Protected
   **/
    public getUser = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId;
        const user = await this.userService.getUserById(userId!);
        res.json(user);
    })

    /**
   * @route POST /user/request-password-reset
   * @scope Public
   **/
    public requestPasswordReset = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { email } = req.body;
        const user = await this.userService.getUserByEmail(email);

        const resetToken = resettokenService.generateToken({userid: user.id}, '5m');
        const resetUrl = `${process.env.CLIENT_ORIGIN}/auth/reset-password?token=${resetToken}`;
        const html = resetPassTemplate(resetUrl);
        notificationClient.SendMail({ to: user.email, subject: "Password Reset Request", html }, (error: any | null, response: any) => {
            if (error) {
                const status = mapGrpcErrorToHttpStatus(error);
                const message = error.details;
                return res.status(status).json({ message })
            }

            return res.json({ message: "Password reset email sent" });
        })
    })

    /**
   * @route POST /user/reset-password
   * @scope Public
   **/
    public resetPassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { token, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let userid: string;
        try {     
            const decoded = resettokenService.verifyToken(token);
            userid = decoded.userid;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        await this.userService.updatePassword({userid, password: newPassword});
        return res.sendStatus(200)
    })
}




// export class UserController {
//     private service: IUserService;

//     constructor(userService: IUserService) {
//         this.service = userService;
//     }

//     getProcedures() {
//         return {
//             CreateUser: this.createUser.bind(this),
//             ValidateUser: this.validateUser.bind(this),
//             GetUser: this.getUser.bind(this),
//         };
//     }

//     private createUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const data = call.request;
//             console.log({data});
//             const response = await this.service.createUser(data);
//             callback(null, response);
//         }
//     );

//     private validateUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const data = call.request;
//             const response = await this.service.validateUser(data);
//             callback(null, response);
//         }
//     );

//     private getUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const id = call.request.userId;
//             const response = await this.service.getUserById(id);
//             callback(null, response);
//         }
//     );
// }