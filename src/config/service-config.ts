import AuthService from "../service/AuthService";
import AuthServiceJWT from "../service/AuthServiceJwt";
import EmployeesService from "../service/EmployeesService";
import EmployeesServiceRest from "../service/EmployeesServiceRest";

export const authService: AuthService = new AuthServiceJWT('https://spotless-ruby-addition.glitch.me/login')
export const employeesService: EmployeesService = new EmployeesServiceRest('https://spotless-ruby-addition.glitch.me/employees')
// export const authService: AuthService = new AuthServiceJWT('http://localhost:3500/login')
// export const employeesService: EmployeesService = new EmployeesServiceRest('http://localhost:3500/employees')