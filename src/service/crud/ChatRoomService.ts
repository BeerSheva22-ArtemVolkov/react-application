import { Observable } from "rxjs";
import ChatGroupType from "../../model/ChatGroupType";

export default interface ChatRoom {
    // addEmployee(empl: Employee): Promise<Employee>;
    getNewewst(): Observable<string>;
    getActive(): Observable<any[]>
    getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string, filterDateTimeFrom: string, filterDateTimeTo: string): Promise<any>
    // deleteEmployee(id: any): Promise<void>;
    // updateEmployee(empl: Employee): Promise<Employee>;
    sendWSMessage(message: any, to: string, group: string): void
    getGroups(filterName?: string): Promise<any>
    getAllChats(): Promise<any>
    createGroup(chatGroup: ChatGroupType): Promise<any>
    deleteUserFromChat(chatName: string, userName: string): Promise<any>
    joinToChat(chatName: string): Promise<any>
    updateGroup(chatGroup: ChatGroupType): Promise<any>
    deleteMessage(messageId: string): Promise<any>
}