import AuthService from "../service/auth/AuthService";
import AuthServiceJwt from "../service/auth/AuthServiceJwt";
import EmployeesService from "../service/crud/EmployeesService";
import EmployeesServiceRest from "../service/crud/EmployeesServiceRest";

export const authService: AuthService = new AuthServiceJwt('http://localhost:8080/users/login');
export const employeesService: EmployeesService = new EmployeesServiceRest("localhost:8080");