import AuthService from "../service/auth/AuthService";
import AuthServiceJwt from "../service/auth/AuthServiceJwt";
import EmployeesService from "../service/crud/EmployeesService";
import EmployeesServiceRest from "../service/crud/EmployeesServiceRest";

export const authService: AuthService = new AuthServiceJwt('http://localhost:3500/users/login');
export const employeesService: EmployeesService = new EmployeesServiceRest("http://localhost:3500/employees");