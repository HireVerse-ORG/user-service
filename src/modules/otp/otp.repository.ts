import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { IOtpRepository } from "./interfaces/otp.repository";
import Otp, { IOTP } from "./otp.entity";
import { injectable } from "inversify";

@injectable()
export class OtpRepository extends MongoBaseRepository<IOTP> implements IOtpRepository  {
    constructor() {
        super(Otp)
    }
}