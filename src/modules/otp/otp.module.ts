import { Container } from "inversify";
import TYPES from '../../core/container/container.types';
import { IOtpRepository } from "./interfaces/otp.repository";
import { IOtpService } from "./interfaces/otp.service.interface";
import { OtpController } from "./otp.controller";
import { OtpRepository } from "./otp.repository";
import { OtpService } from "./otp.service";

function loadOtpContainer(container: Container) {
    container.bind<IOtpService>(TYPES.OtpService).to(OtpService);
    container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
    container.bind<OtpController>(TYPES.OtpController).to(OtpController);
}

export { loadOtpContainer }
