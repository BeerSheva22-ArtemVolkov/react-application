import LoginData from "../model/LoginData";
import UserData from "../model/UserData";
import AuthService from "./AuthService";

export const AUTH_DATA_JWT = 'auth-data-jwt'

function getUserData(data: any): UserData {

    const jwt = data.accessToken
    localStorage.setItem(AUTH_DATA_JWT, jwt)
    const jwtPayloadJSON = atob(jwt.split('.')[1])
    const jwtPayloadObj = JSON.parse(jwtPayloadJSON)
    return { email: jwtPayloadObj.email, role: jwtPayloadObj.sub }
}

export default class AuthServiceJWT implements AuthService {

    constructor(private url: string) { }

    async login(loginData: LoginData): Promise<UserData | null> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        return response.ok ? getUserData(await response.json()) : null
    }

    async logut(): Promise<void> {
        localStorage.removeItem(AUTH_DATA_JWT)
    }
}