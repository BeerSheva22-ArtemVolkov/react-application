import UserData from "../model/UserData";
import AuthService from "./AuthService";

export default class AuthServiceJWT implements AuthService {

    constructor(private url: string) {
        this.url = url
    }

    // async login(loginData: { email: string; password: string; }): Promise<UserData | null> {
    async login(loginData: { email: string; password: string; }): Promise<any | null> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        return response.json()
    }
    async logut(): Promise<void> {
        //TODO
    }
}