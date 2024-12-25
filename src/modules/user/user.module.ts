import { IUserService } from "./interfaces/user.service.interface";
import { UserService } from "./user.service";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { container } from "../../core/inversify";
import TYPES from '../../core/types';


const usercontainer = container.createChild();

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserController>(TYPES.UserController).to(UserController);

export { usercontainer };