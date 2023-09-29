import { Observable } from "rxjs";

export default interface ChatRoom {
    // addEmployee(empl: Employee): Promise<Employee>;
    getNewewst(): Observable<string>;
    getActive(): Observable<any[]>
    getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string, filterDateTimeFrom: string, filterDateTimeTo: string): Promise<any>
    // deleteEmployee(id: any): Promise<void>;
    // updateEmployee(empl: Employee): Promise<Employee>;
    sendWSMessage(message: any, to: string, group: string): void
    getGroups(): Promise<any>
    createGroup(chatName: string, isOpened: boolean, membersIds: string[], adminsIds: string[]): Promise<any>
}