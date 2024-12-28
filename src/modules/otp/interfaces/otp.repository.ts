import { IRepository } from "@hireverse/service-common/dist/repository";
import { IOTP } from "../otp.entity";

export interface IOtpRepository extends IRepository<IOTP> {
    findByEmail(email: string) : Promise<IOTP | null>;
}