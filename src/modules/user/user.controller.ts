import { Request, Response } from 'express';
import BaseController from "../../core/base.controller";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import { INotificationService } from '../external/notification/notification.service.interface';
import { ITokenService } from '../external/token/token.service.interface';
import { IProfileService } from '../external/profile/profile.service.interface';
import { ProfileUser } from './dto/user.dto';
import { IPaymentService } from '../external/payment/payment.service.interface';

@injectable()
export class UserController extends BaseController {
    @inject(TYPES.UserService) private userService!: IUserService;
    @inject(TYPES.TokenService) private tokenService!: ITokenService;
    @inject(TYPES.NotificationService) private notificationService!: INotificationService;
    @inject(TYPES.ProfileService) private profileService!: IProfileService;
    @inject(TYPES.PaymentService) private paymentService!: IPaymentService;

    /**
* @route POST /user/auth/google
* @scope Public
**/
    public googleSignIn = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { gToken, role } = req.body;
        const { created, user } = await this.userService.verifyGoogleUser(gToken, role);
        if (created && user.role === "seeker") {
            try {
                await this.profileService.createSeekerProfile(user.fullname, user.id)
                await this.paymentService.createSeekerFreePlan({email: user.email, name: user.fullname, userId: user.id});
                return res.status(201).json({ user });
            } catch (error: any) {
                // return res.status(error.status).json(error.message);
            }
        }
        const token = this.tokenService.generateUserToken(user);
        const refreashToken = this.tokenService.generateRefreshToken(user);
        await this.userService.setRefreshToken(user.id, refreashToken);
        res.json({ user, token });
    });

    /**
* @route POST /user/auth/microsoft
* @scope Public
**/
    public microsoftSignIn = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { msToken, role } = req.body;
        const { created, user } = await this.userService.verifyMicrosoftUser(msToken, role);
        if (created && user.role === "seeker") {
            try {
                await this.profileService.createSeekerProfile(user.fullname, user.id)
                await this.paymentService.createSeekerFreePlan({email: user.email, name: user.fullname, userId: user.id});
                return res.status(201).json({ user });
            } catch (error: any) {
                // return res.status(error.status).json(error.message);
            }
        }
        const token = this.tokenService.generateUserToken(user);
        const refreashToken = this.tokenService.generateRefreshToken(user);
        await this.userService.setRefreshToken(user.id, refreashToken);
        res.json({ user, token });
    });

    /**
   * @route GET /user/login
   * @scope Public
   **/
    public login = asyncWrapper(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.userService.validateUser({ email, password });
        const token = this.tokenService.generateUserToken(user);
        const refreashToken = this.tokenService.generateRefreshToken(user);
        await this.userService.setRefreshToken(user.id, refreashToken);
        res.json({ user, token });
    });

    /**
   * @route POST /user/register
   * @scope Public
   **/
    public create = asyncWrapper(async (req: Request, res: Response) => {
        const { fullname, email, password, role } = req.body;
        const user = await this.userService.createUser({ fullname, email, password, role });
        if (user.role === "seeker") {
            try {
                await this.profileService.createSeekerProfile(user.fullname, user.id);
                await this.paymentService.createSeekerFreePlan({email: user.email, name: user.fullname, userId: user.id});
                return res.status(201).json({ user });
            } catch (error: any) {
            //    console.log(error);
            }
        }
        return res.status(201).json({ user });
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
        const resetToken = this.tokenService.generateResetPasswordToken({ userid: user.id });
        try {
            const response = await this.notificationService.sendResetPasswordEmail(email, resetToken);
            return res.status(response.status).json(response.message);
        } catch (error: any) {
            return res.status(error.status).json(error.message);
        }
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
        const { userid } = this.tokenService.verifyResetPasswordToken(token);
        await this.userService.updatePassword({ userid, password: newPassword });
        return res.json({ message: `Password updated succesfully` })
    })

    /**
   * @route POST /user/refresh-token
   * @scope Public
   **/
    public refresToken = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { userId } = req.body;
        const refreshToken = await this.userService.getRefreshToken(userId);
        this.tokenService.verifyRefreshToken(refreshToken);
        const user = await this.userService.getUserById(userId);
        const token = this.tokenService.generateUserToken(user);
        return res.json({ token });
    })

    /**
    * @route GET /user/list?role=seeker&page=1&limit=10&query=''
    * @scope Private for admin
    **/
    public listUsers = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { role, page = 1, limit = 10, query } = req.query;
        const data = await this.userService.getUsersByRole(role as string, page as number, limit as number, query as string);
        return res.json(data);
    });

    /**
    * @route GET /user/list/companies?page=1&limit=10&query=''&status=all/requested/rejected
    * @scope Private for admin
    **/
    public listCompanies = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { page = 1, limit = 10, query, status } = req.query;

        const data = await this.userService.getUsersByRole("company", page as number, limit as number, query as string);

        const usersWithProfiles = await Promise.all(
            (data.data as ProfileUser[]).map(async (user) => {
                try {
                    const profileResponse = await this.profileService.getCompanyProfileByUserId(user.id);
                    user.profile = profileResponse.response.profile || null;
                } catch (error) {
                    user.profile = null;
                }
                return user;
            })
        );

        if (status === "rejected") {
            data.data = usersWithProfiles.filter((user) => user.profile?.status === "rejected");
        } else if (status === "requested") {
            data.data = usersWithProfiles.filter((user) => user.profile?.status === "pending");
        } else {
            data.data = usersWithProfiles;
        }

        return res.json(data);
    });

    /**
  * @route PUT /user/block-user
  * @scope Private for admin
  **/
    public toggleUserBlockStatus = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { userId, isBlocked } = req.body;
        await this.userService.toggleBlockStatus(userId, isBlocked);
        return res.json({ message: `User block status updated to ${isBlocked}` });
    });
}
