import { Request, Response } from 'express';
import BaseController from "../../core/base.controller";
import { IUserService } from "./interfaces/user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from '../../core/types';

@injectable()
export class UserController extends BaseController {
    @inject(TYPES.UserService) private userService!: IUserService;

    /**
   * @Path /user/login
   * @Method POST 
   * @Scope Public
   **/
    public async login(req: Request, res: Response) {
        console.log(req.body);
        
        await this.userService.validateUser(req.body);
        res.sendStatus(200);
    }

    /**
   * @Path /user
   * @Method POST 
   * @Scope Public
   **/
    public async create(req: Request, res: Response) {
        await this.userService.createUser(req.body);
        res.sendStatus(201);
    }

    /**
   * @Path /user/
   * @Method POST 
   * @Scope Public
   **/
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUserById(req.params.id);
        res.json(user);
    }
}




// export class UserController {
//     private service: IUserService;

//     constructor(userService: IUserService) {
//         this.service = userService;
//     }

//     getProcedures() {
//         return {
//             CreateUser: this.createUser.bind(this),
//             ValidateUser: this.validateUser.bind(this),
//             GetUser: this.getUser.bind(this),
//         };
//     }

//     private createUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const data = call.request;
//             console.log({data});
//             const response = await this.service.createUser(data);
//             callback(null, response);
//         }
//     );

//     private validateUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const data = call.request;
//             const response = await this.service.validateUser(data);
//             callback(null, response);
//         }
//     );

//     private getUser = grpcWrapper(
//         async(call: any, callback: any) => {
//             const id = call.request.userId;
//             const response = await this.service.getUserById(id);
//             callback(null, response);
//         }
//     );
// }