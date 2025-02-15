import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { IUserRepository } from "./interfaces/user.repository.interface";
import User, { IUser } from "./user.entity";
import { injectable } from "inversify";
import { RootFilterQuery } from "mongoose";

@injectable()
export class UserRepository extends MongoBaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async isEmailExist(email: string): Promise<boolean> {
        const exist = await this.findOne({email});
        return !!exist;
    }
    
    async findByEmail(email: string): Promise<IUser | null> {
        return await this.findOne({email});
    }

    async getTotalUsers(filter?: RootFilterQuery<IUser>): Promise<number> {
        return this.repository.countDocuments(filter);
    }

    async getUserGrowth(): Promise<Array<{ month: string; count: number }>> {
        const currentYear = new Date().getFullYear();
        
        return this.repository.aggregate([
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                }
            },
            {
                $match: {
                    year: currentYear
                }
            },
            {
                $group: {
                    _id: { month: "$month" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    month: {
                        $let: {
                            vars: {
                                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            },
                            in: { 
                                $arrayElemAt: [
                                    "$$months", 
                                    { $subtract: ["$_id.month", 1] }
                                ] 
                            }
                        }
                    },
                    count: 1
                }
            }
        ]).exec();
    }

    async getRegistrationStatistics(): Promise<{
        total: number;
        monthlyGrowth: Array<{ month: string; count: number }>;
    }> {
        const [total, monthlyGrowth] = await Promise.all([
            this.getTotalUsers({role: {$ne: "admin"}}),
            this.getUserGrowth()
        ]);

        return {
            total,
            monthlyGrowth
        };
    }
}