import { Observable } from "rxjs";
import ChatGroupType from "../../model/ChatGroupType";
import MessageType from "../../model/MessageType";

export default interface ChatRoom {
    getNewewst(): Observable<MessageType>;
    getActive(): Observable<any[]>
    getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string, filterDateTimeFrom: string, filterDateTimeTo: string): Promise<MessageType[]>
    sendWSMessage(message: any, to: string, group: string): void
    getGroups(filterName?: string): Promise<any>
    getAllChats(): Promise<any>
    createGroup(chatGroup: ChatGroupType): Promise<any>
    deleteUserFromChat(chatName: string, userName: string): Promise<any>
    joinToChat(chatName: string): Promise<any>
    updateGroup(chatGroup: ChatGroupType): Promise<any>
    deleteMessage(messageId: string): Promise<any>
    updateAccount(image: any): Promise<any>
}