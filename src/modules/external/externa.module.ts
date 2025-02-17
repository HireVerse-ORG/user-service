import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { INotificationService } from "./notification/notification.service.interface";
import { NotificationService } from "./notification/notification.service";
import { TokenService } from "./token/token.service";
import { ITokenService } from "./token/token.service.interface";
import { IProfileService } from "./profile/profile.service.interface";
import { IPaymentService } from "./payment/payment.service.interface";
import { ProfileService } from "./profile/profile.service";
import { PaymentService } from "./payment/payment.service";

export function loadExternalContainer(container: Container) {
    container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
    container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
    container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
    container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
}