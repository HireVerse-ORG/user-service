import { IMongoRepository } from "@hireverse/service-common/dist/repository/repository.interface";
import { IUser } from "../user.entity";

export interface IUserRepository extends IMongoRepository<IUser> {
    isEmailExist(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<IUser | null>;
    getRegistrationStatistics(): Promise<{
        total: number;
        monthlyGrowth: Array<{ month: string; count: number }>;
    }>
}