import { notificationClient } from "../../../core/rpc/clients"

notificationClient
export interface INotificationService {
    sendOtpEmail(email: string, otp: string) : Promise<{status: number, message: string}>
    sendResetPasswordEmail(email: string, resetToken: string, resetPageLink: string) : Promise<{status: number, message: string}>
}