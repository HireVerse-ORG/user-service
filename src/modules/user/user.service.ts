import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { UserCreateDto, UserValidateDto } from "./dto/user.dto";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/types';
import { isValidObjectId } from "mongoose";

@injectable()
export class UserService implements IUserService {
  @inject(TYPES.UserRepository) private repo!: IUserRepository;

  async validateUser(data: UserValidateDto) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    if(! await user.validatePassword(data.password)){
      throw new BadRequestError('Invalid password');
    }

    return { message: 'User found', userId: user.id, role: user.role };
  }

  async createUser(data: UserCreateDto) {
    if (await this.repo.isEmailExist(data.email)) {
      throw new BadRequestError('Email already exists');
    }

    const user = await this.repo.create({ ...data });
    return { message: 'User created successfully', userId: user.id, role: user.role };
  }

  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const user = await this.repo.findById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return { ...user, connectionCount: 0 };
  }
}