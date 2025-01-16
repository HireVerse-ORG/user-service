import { Container } from "inversify";
import { loadUserContainer } from "../../modules/user/user.module";
import { loadOtpContainer } from "../../modules/otp/otp.module";
import TYPES from "./container.types";
import { NotificationService } from "../../modules/external/notification/notification.service";
import { INotificationService } from "../../modules/external/notification/notification.service.interface";
import { ITokenService } from "../../modules/external/token/token.service.interface";
import { TokenService } from "../../modules/external/token/token.service";
import { ProfileService } from "../../modules/external/profile/profile.service";
import { IProfileService } from "../../modules/external/profile/profile.service.interface";
import { IPaymentService } from "../../modules/external/payment/payment.service.interface";
import { PaymentService } from "../../modules/external/payment/payment.service";

const container = new Container();

container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);

loadUserContainer(container);
loadOtpContainer(container);

export { container };

