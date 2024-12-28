import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { UserCreateDto, UserDto, UserUpdateDto, UserValidateDto } from "./dto/user.dto";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/types';
import { isValidObjectId } from "mongoose";
import { IUser, UserRole } from "./user.entity";

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

    return this.userResponse(user);;
  }

  async createUser(data: UserCreateDto, allowedRoles: UserRole[] = [UserRole.COMPANY, UserRole.SEEKER]) {
    if (!allowedRoles.includes(data.role)) {
      throw new BadRequestError(`Role '${data.role}' is not allowed to be created.`);
    }

    if (await this.repo.isEmailExist(data.email)) {
      throw new BadRequestError('Email already exists');
    }

    const user = await this.repo.create({ ...data });
    return this.userResponse(user);
  }

  async verifyUser(email: string){
    const user = await this.repo.findByEmail(email);
    if(!user){
      throw new NotFoundError("User not found");
    }
    user.isVerified = true;
    await user.save();

    return this.userResponse(user);
  }

  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const user = await this.repo.findById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return this.userResponse(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return this.userResponse(user);
  }

  private userResponse(userData: IUser): UserDto{
    return {
      id: userData.id,
      fullname: userData.fullname,
      email: userData.email,
      role: userData.role,
      isVerified: userData.isVerified,
      isBlocked: userData.isBlocked
    }
  }
}