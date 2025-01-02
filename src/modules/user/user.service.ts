import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { UpdatePasswordDto, UserCreateDto, UserDto, UserValidateDto } from "./dto/user.dto";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { FilterQuery, isValidObjectId } from "mongoose";
import { IUser, UserRole } from "./user.entity";
import { querySanitizer } from "@hireverse/service-common/dist/utils";
import { microsoftConfig, verifyMsToken } from "../../core/utils/msutil";

@injectable()
export class UserService implements IUserService {
  @inject(TYPES.UserRepository) private repo!: IUserRepository;

  async validateUser(data: UserValidateDto) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (! await user.validatePassword(data.password)) {
      throw new BadRequestError('Invalid password');
    }

    return this.userResponse(user);
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

  async verifyUser(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
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

  async updatePassword(data: UpdatePasswordDto): Promise<string> {
    const user = await this.repo.findById(data.userid);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.password = data.password;
    await user.save();

    return "Password updated"
  }

  async toggleBlockStatus(id: string, isBlocked: boolean): Promise<string> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.isBlocked = isBlocked;
    await user.save();

    return `User block status updated to: ${isBlocked}`;
  }

  async getUsersByRole(role: string, page = 1, limit = 10, query = '') {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestError('Invalid role provided');
    }

    query = querySanitizer(query);

    const filter: FilterQuery<IUser> = { role };

    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }

    const paginatedData = await this.repo.paginate(filter, page, limit);
    const transformedData = paginatedData.data.map(user => this.userResponse(user));
    return {
      ...paginatedData,
      data: transformedData
    }
  }

  async verifyMicrosoftUser(accessToken: string, role: UserRole): Promise<UserDto> {
    try {
      const {name, email, sub} = await verifyMsToken(accessToken, microsoftConfig.clientId, microsoftConfig.authority);
      if(!email){
        throw new Error("Microsoft account does not have an email associated");
      }
      if (!name || !sub) {
        throw new Error("Failed to autheticate using Microsoft");
      }
      let user = await this.repo.findOne({email});
      if(!user){
        user = await this.repo.create({email, fullname: name, password: sub, role, isVerified: true});
      } else if(!user.isVerified){
        await this.repo.update(user.id, {isVerified: true});
      }
      return this.userResponse(user);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  private userResponse(userData: IUser): UserDto {
    return {
      id: userData.id,
      fullname: userData.fullname,
      email: userData.email,
      role: userData.role,
      isVerified: userData.isVerified,
      isBlocked: userData.isBlocked,
      createAt: userData.createdAt
    }
  }
}