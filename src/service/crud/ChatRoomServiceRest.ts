import { Observable, Subscriber } from "rxjs";
import { AUTH_DATA_JWT } from "../auth/AuthServiceJwt";
import ChatRoom from "./ChatRoomService";
import ChatGroupType from "../../model/ChatGroupType";
import MessageType from "../../model/MessageType";

const AUTH_ITEM = "auth-item"

// async function getResponseText(response: Response): Promise<string> {
//     let res = '';
//     if (!response.ok) {
//         const { status } = response;
//         res = status == 401 || status == 403 ? 'Authentication' : await response.text();
//     }
//     return res
// }

// function getHeaders(): HeadersInit {
//     const res: HeadersInit = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
//     }
//     return res;
// }

// async function fetchRequest(url: string, options: RequestInit, empl?: Employee): Promise<Response> {
//     options.headers = getHeaders();
//     if (empl) {
//         options.body = JSON.stringify(empl);
//     }

//     let flUpdate = true;
//     let responseText = '';
//     try {
//         if (options.method == "DELETE" || options.method == "PUT") {
//             flUpdate = false;
//             await fetchRequest(url, { method: "GET" });
//             flUpdate = true;
//         }

//         const response = await fetch(url, options);
//         responseText = await getResponseText(response);
//         if (responseText) {
//             throw responseText;
//         }
//         return response;
//     } catch (error: any) {
//         if (!flUpdate) {
//             throw error;
//         }
//         throw responseText ? responseText : "Server is unavailable. Repeat later on";
//     }
// }

// async function fetchAllEmployees(url: string): Promise<Employee[] | string> {
//     const response = await fetchRequest(url, {});
//     return await response.json()
// }

export default class ChatRoomServiceRest implements ChatRoom {

    private newestObservable: Observable<MessageType> | null = null;
    private activeObservable: Observable<any[]> | null = null;
    private newestSubscriber: Subscriber<MessageType> | undefined;
    private activeSubscriber: Subscriber<any[]> | undefined;
    private urlService: string;
    private urlWebSocket: string;
    private webSocket: WebSocket | undefined;
    private globalWebSocket: WebSocket | undefined;
    // private cache: Cache;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}`
        this.urlWebSocket = `ws://${baseUrl}`
        // this.cache = new Cache;
    }

    async getAllMessages(): Promise<any> {
        const res = await fetch(this.urlService + `/messages/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            }
        })
        const data = await res.json();
        return data;
    }

    async updateAccount(image: string): Promise<any> {
        const res = await fetch(this.urlService + `/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            },
            body: JSON.stringify({ image })
        })
        const data = await res.json();
        return data;
    }

    async joinToChat(chatName: string): Promise<any> {
        const res = await fetch(this.urlService + `/chats/join/${chatName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            }
        })
        const data = await res.json();
        return data;
    }

    async deleteMessage(messageId: string): Promise<any> {
        const res = await fetch(this.urlService + `/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            }
        })
        const data = await res.json();
        return data;
    }

    async deleteUserFromChat(chatName: string, userName: string): Promise<any> {
        const res = await fetch(this.urlService + `/chats/removeUser/${chatName}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            },
            body: JSON.stringify({ userName })
        })
        const data = await res.json();
        return data;
    }

    async createGroup(chatGroup: ChatGroupType): Promise<any> {
        const res = await fetch(this.urlService + "/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            },
            body: JSON.stringify(chatGroup)
        })
        const data = await res.json();
        return data;
    }

    async updateGroup(chatGroup: ChatGroupType): Promise<any> {
        const res = await fetch(this.urlService + "/chats", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            },
            body: JSON.stringify(chatGroup)
        })
        const data = await res.json();
        return data;
    }

    sendWSMessage(message: any, to: string, group: string): void {
        this.webSocket?.send(JSON.stringify({
            ...to && { to },
            ...group && { group },
            ...message && { text: message }
        }))
    }

    getNewewst(): Observable<MessageType> {
        if (!this.newestObservable) {
            this.newestObservable = new Observable<MessageType>(subscriber => {
                this.newestSubscriber = subscriber;
                // this.subscriberNext();
                this.connectWS();
                return () => this.disconnectWS();
            })
        }
        return this.newestObservable;
    }

    getActive(): Observable<any[]> {
        if (!this.activeObservable) {
            this.activeObservable = new Observable<any[]>(subscriber => {
                this.activeSubscriber = subscriber;
                // this.subscriberNext();
                this.connectGlobalWS();
                return () => this.disconnectGlobalWS();
            })
        }
        return this.activeObservable;
    }

    private chatSubscriberNext(messageFromWS: any): void {
        this.newestSubscriber?.next(messageFromWS);
    }

    private globalSubscriberNext(activeUsers: any[]): void {
        this.activeSubscriber?.next(activeUsers);
    }

    async getAllChats(): Promise<any> {
        const res = await fetch(this.urlService + "/allChats", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || ''
            }
        })
        const data = await res.json();
        return data;
    }

    async getGroups(FilterName?: string): Promise<any> {
        const res = await fetch(this.urlService + "/chats", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || '',
                "filtername": FilterName || ''
            }
        })
        const data = await res.json();
        return data;
    }

    async getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string, filterDateTimeFrom: string, filterDateTimeTo: string): Promise<MessageType[]> {
        const userName = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');
        const response = await fetch(this.urlService + "/messages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || '',
                "from": includeFrom ? userName.email : '',
                "to": type == "to" ? chatName : '',
                "group": type == "group" ? chatName : '',
                "filter": filterFrom ? filterFrom : '',
                "dtf": filterDateTimeFrom ? filterDateTimeFrom : '',
                "dtt": filterDateTimeTo ? filterDateTimeTo : ''
            }
        });
        const data = await response.json();
        return data
    }

    private connectWS() {
        const userName = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');
        this.webSocket = new WebSocket(`${this.urlWebSocket}/contacts/websocket/${userName.email}`, localStorage.getItem(AUTH_DATA_JWT) || '');
        this.webSocket.onopen = () => {
            console.log('websocket connected');
        }

        this.webSocket.onmessage = message => { // listener
            this.chatSubscriberNext(JSON.parse(message.data));
        }
    }

    private connectGlobalWS() {
        this.globalWebSocket = new WebSocket(`${this.urlWebSocket}/global`);
        this.globalWebSocket.onopen = () => {
            console.log('websocket connected');
        }

        this.globalWebSocket.onmessage = message => { // listener
            this.globalSubscriberNext(JSON.parse(message.data));
        }
    }

    private disconnectWS(): void {
        this.webSocket?.close();
    }

    private disconnectGlobalWS(): void {
        this.globalWebSocket?.close();
    }

}