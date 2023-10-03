import { Observable, Subscriber } from "rxjs";
// import Employee from "../../model/Employee";
import { AUTH_DATA_JWT } from "../auth/AuthServiceJwt";
import ChatRoom from "./ChatRoomService";
import NotifierType from "../../model/NotifierType"
import ChatGroupType from "../../model/ChatGroupType";

const AUTH_ITEM = "auth-item"
// class Cache {

//     private cache: Map<number, Employee> = new Map();

//     addToCache(id: number, empl: Employee) {
//         this.cache.set(id, empl);
//     }

//     deleteFromCache(id: number) {
//         this.cache.delete(id);
//     }

//     updateCache(id: number, empl: Employee) {
//         console.log(id, empl);

//         this.cache.set(id, empl);
//     }

//     setCache(empls: Employee[]) {
//         empls.forEach(empl => this.cache.set(empl.id, empl));
//     }

//     clearCache() {
//         this.cache = new Map();
//     }

//     getCache(): Employee[] {
//         return Array.from(this.cache.values());
//     }

//     isEmpty(): Boolean {
//         return this.cache.size == 0;
//     }

// }
// let userName = ""
// const token = localStorage.getItem(AUTH_DATA_JWT) || '';
// if (token) {
//     const jwtPayloadJSON = atob(token.split('.')[1]);
//     const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
//     userName = jwtPayloadObj.sub;
// }
// const userName = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');


async function getResponseText(response: Response): Promise<string> {
    let res = '';
    if (!response.ok) {
        const { status } = response;
        res = status == 401 || status == 403 ? 'Authentication' : await response.text();
    }
    return res
}

function getHeaders(): HeadersInit {
    const res: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
    }
    return res;
}

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

    private newestObservable: Observable<string> | null = null;
    private activeObservable: Observable<any[]> | null = null;
    // private chatsObservable: Observable<any[]> | null = null;
    // private allObservable: Observable<string> | null = null;
    private newestSubscriber: Subscriber<string> | undefined;
    private activeSubscriber: Subscriber<any[]> | undefined;
    // private chatsSubscriber: Subscriber<any[]> | undefined;
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

    // async updateEmployee(empl: Employee): Promise<Employee> {
    //     const response = await fetchRequest(this.getUrlWithId(empl.id!),
    //         { method: 'PUT' }, empl);
    //     return await response.json();
    // }

    // async deleteEmployee(id: any): Promise<void> {
    //     await fetchRequest(this.getUrlWithId(id), {
    //         method: 'DELETE',
    //     });
    // }

    getNewewst(): Observable<string> {
        if (!this.newestObservable) {
            this.newestObservable = new Observable<string>(subscriber => {
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
        // fetchAllEmployees(this.urlService).then(employees => {
        this.newestSubscriber?.next(messageFromWS);
        // this.cache.setCache(employees as Employee[]);
        // }).catch(error => this.subscriber?.next(error));
    }

    private globalSubscriberNext(activeUsers: any[]): void {
        // fetchAllEmployees(this.urlService).then(employees => {
        this.activeSubscriber?.next(activeUsers);
        // this.cache.setCache(employees as Employee[]);
        // }).catch(error => this.subscriber?.next(error));
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

    async getFromChat(chatName: string, includeFrom: boolean, type: string, filterFrom: string, filterDateTimeFrom: string, filterDateTimeTo: string): Promise<any> {
        // 1.1  Если запрос для чата группы:
        //      from-, chatName(group)+, 
        // 1.2  Если запрос для чата группы с фильтром:
        //      from-, chatName(group)+, filterFrom+-, dateTime(потом)+-
        // 2.1  Если запрос для личной переписки:
        //      from+, chatName(to)+,
        // 2.2  Если запрос для личной переписки с фильтром:
        //      from+, chatName(to)+, filterFrom+-, dateTime(потом)+-
        const userName = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');
        const response = await fetch(this.urlService + "/messages", {
            method: "GET",
            // body: JSON.stringify(type == "to" ? { from, to: chatName } : { from, group: chatName }),
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
            this.chatSubscriberNext(message.data);
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


    // async addEmployee(empl: Employee): Promise<Employee> {
    //     if (empl.id == 0) {
    //         delete empl.id;
    //     }
    //     const response = await fetchRequest(this.urlService, {
    //         method: 'POST',
    //     }, empl);
    //     return response.json();
    // }

}