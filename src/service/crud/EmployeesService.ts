import { Observable } from "rxjs";
import Employee from "../../model/Employee";

export default interface EmployeesService {
    // addEmployee(empl: Employee): Promise<Employee>;
    getNewewst(): Observable<string>;
    getFromChat(chatName: string, from: string, type: string): Promise<any>
    // deleteEmployee(id: any): Promise<void>;
    // updateEmployee(empl: Employee): Promise<Employee>;
    sendWSMessage(message: any): void
    getGroups(owner: string): Observable<any[]>
}