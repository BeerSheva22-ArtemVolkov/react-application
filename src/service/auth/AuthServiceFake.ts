import LoginData from "../../model/LoginData";
import UserData from "../../model/UserData";
import AuthService, { NetworkType } from "./AuthService";

export default class AuthServiceFake implements AuthService {
    getAvailableProviders(): NetworkType[] {
        throw new Error("Method not implemented.");
    }

    async login(loginData: LoginData): Promise<UserData> {
        const userData: UserData = {
            email: loginData.email,
            role: loginData.email.includes('admin') ? 'admin' : 'user'
        }
        return userData
    }

    async logout(): Promise<void> {
        
    }

}