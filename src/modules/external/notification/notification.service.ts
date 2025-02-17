import { injectable } from "inversify";
import { INotificationService } from "./notification.service.interface";
import { notificationClient } from "../../../core/rpc/clients";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";
import resetPassTemplate from "../../../core/utils/htmlTemplates/resetPassTemplate";
import otpTemplate from "../../../core/utils/htmlTemplates/otpTemplate";

@injectable()
export class NotificationService implements INotificationService {

    async sendOtpEmail(email: string, otp: string): Promise<{ status: number; message: string; }> {
        return new Promise((resolve, reject) => {
            const html = otpTemplate(otp);
            notificationClient.SendMail({ to: email, subject: "Email Verification", html }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({status: 200, message: "Otp created sucessfully" });
            })
        })
    }

    async sendResetPasswordEmail(email: string, resetToken: string, resetPageLink: string): Promise<{ status: number, message: string }> {
        const expiry = new Date(Date.now() + 300000).toISOString();
        const resetUrl = `${resetPageLink}?token=${resetToken}&&expiry=${expiry}`;
        const html = resetPassTemplate(resetUrl);

        return new Promise((resolve, reject) => {
            notificationClient.SendMail({ to: email, subject: "Password Reset Request", html }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({ status: 200, message: "Password reset email sent" });
            })
        });
    }
}