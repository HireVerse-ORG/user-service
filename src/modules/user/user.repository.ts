import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { User } from "./user.entity";
import { AppDataSource } from "../../core/database/ormconfig";
import { injectable } from "inversify";

@injectable()
export class UserRepository extends PostgresBaseRepository<User> implements IUserRepository {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async isEmailExist(email: string): Promise<boolean> {
        const exist = await this.repository.findOne({ where: { email }});
        return !!exist;
    }
    
    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email }});
    }
}