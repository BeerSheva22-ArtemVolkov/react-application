import UserData from "../model/UserData";

export default interface AuthService {
    // все возвращают promise
    // login(loginData: { email: string, password: string }): Promise<UserData | null>
    login(loginData: { email: string, password: string }): Promise<string | null>
    logut(): Promise<void>
}