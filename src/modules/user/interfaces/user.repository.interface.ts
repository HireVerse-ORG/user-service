import { IRepository } from "@hireverse/service-common/dist/repository/repository.interface";
import { User } from "../user.entity";

export interface IUserRepository extends IRepository<User> {
    isEmailExist(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
}