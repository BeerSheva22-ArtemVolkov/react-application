import { Observable } from "rxjs";
import Employee from "../../model/Employee";

export default interface EmployeesService {
    // addEmployee(empl: Employee): Promise<Employee>;
    getNewewst(): Observable<string>;
    getActive(): Observable<any[]>
    getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string): Promise<any>
    // deleteEmployee(id: any): Promise<void>;
    // updateEmployee(empl: Employee): Promise<Employee>;
    sendWSMessage(message: any, to: string, group: string): void
    getGroups(): Promise<any>
}