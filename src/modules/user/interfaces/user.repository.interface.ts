import { IRepository } from "@hireverse/service-common/dist/repository/repository.interface";
import { IUser } from "../user.entity";

export interface IUserRepository extends IRepository<IUser> {
    isEmailExist(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<IUser | null>;
}