import LoginData from "../model/LoginData";
import UserData from "../model/UserData";

export default interface AuthService {
    [x: string]: any;
    login(loginData: LoginData): Promise<UserData>
    logout(): Promise<void>
}