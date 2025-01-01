import { IMongoRepository } from "@hireverse/service-common/dist/repository";
import { IOTP } from "../otp.entity";

export interface IOtpRepository extends IMongoRepository<IOTP> {
    findByEmail(email: string) : Promise<IOTP | null>;
}