import AuthService from "../service/AuthService";
import AuthServiceJWT from "../service/AuthServiceJwt";

export const authService: AuthService = new AuthServiceJWT('http://localhost:3500/login')