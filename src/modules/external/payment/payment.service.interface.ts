export interface IPaymentService {
    createSeekerFreePlan(data:{email: string, name: string, userId: string}) : Promise<{status: number, message: string}>
    createCompanyFreePlan(data:{email: string, name: string, userId: string}) : Promise<{status: number, message: string}>
}