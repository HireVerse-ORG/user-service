import { injectable } from "inversify";
import { IPaymentService } from "./payment.service.interface";
import { seekerPaymentClient } from "../../../core/rpc/clients";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";

@injectable()
export class PaymentService implements IPaymentService {
    async createSeekerFreePlan(data: { email: string; name: string; userId: string; }): Promise<{ status: number; message: string; }> {
        return new Promise((resolve, reject) => {
            seekerPaymentClient.CreateFreePlan(data, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message });
                }

                return resolve({ status: 200, message: "Created free plan for seeker" });
            })
        })
    }
}