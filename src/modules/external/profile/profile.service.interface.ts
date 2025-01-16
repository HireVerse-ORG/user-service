import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IProfileService {
    createSeekerProfile(profileName: string, userid: string): Promise<RPCServiceResponseDto>;
    getCompanyProfileByUserId(userid: string): Promise<RPCServiceResponseDto>;
}