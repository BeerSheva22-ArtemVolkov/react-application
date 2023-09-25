import { Observable, Subscriber } from "rxjs";
// import Employee from "../../model/Employee";
import { AUTH_DATA_JWT } from "../auth/AuthServiceJwt";
import EmployeesService from "./EmployeesService";
import NotifierType from "../../model/NotifierType"

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

export default class EmployeesServiceRest implements EmployeesService {

    private newestObservable: Observable<string> | null = null;
    private chatsObservable: Observable<any[]> | null = null;
    // private allObservable: Observable<string> | null = null;
    private newestSubscriber: Subscriber<string> | undefined;
    private chatsSubscriber: Subscriber<any[]> | undefined;
    private urlService: string;
    private urlWebSocket: string;
    private webSocket: WebSocket | undefined;
    // private cache: Cache;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}`
        this.urlWebSocket = `ws://${baseUrl}/contacts/websocket`
        // this.cache = new Cache;
    }

    sendWSMessage(message: any): void {
        this.webSocket?.send(JSON.stringify({ group: "TelRan", "text": message }))
    }

    // async updateEmployee(empl: Employee): Promise<Employee> {
    //     const response = await fetchRequest(this.getUrlWithId(empl.id!),
    //         { method: 'PUT' }, empl);
    //     return await response.json();
    // }

    private getUrlWithId(id: any): string {
        return `${this.urlService}/${id}`;
    }

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

    private chatSubscriberNext(messageFromWS: any): void {
        // fetchAllEmployees(this.urlService).then(employees => {
        this.newestSubscriber?.next(messageFromWS);
        // this.cache.setCache(employees as Employee[]);
        // }).catch(error => this.subscriber?.next(error));
    }

    getGroups(owner: string): Observable<any[]> {
        let intervalId: any;
        if (!this.chatsObservable) {
            this.chatsObservable = new Observable<any[]>(subscriber => {
                this.chatsSubscriber = subscriber;
                this.subscriberNext(subscriber);
                return () => this.disconnectWS();
            })
        }
        return this.chatsObservable;
    }

    private subscriberNext(subscriber: Subscriber<any[] | string>): void {

        fetchAllEmployees(url).then(employees => {
            if (this.cache.isEmpty() || !this.cache.isEqual(employees as Employee[])) {
                this.cache.set(employees as Employee[]);
                subscriber.next(employees);
            }

        }).catch(error => subscriber.next(error));
    }

    async getFromChat(chatName: string, from: string, type: string): Promise<any> {
        console.log(chatName, from, type);

        const response = await fetch(this.urlService + "/messages", {
            method: "GET",
            // body: JSON.stringify(type == "to" ? { from, to: chatName } : { from, group: chatName }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem(AUTH_DATA_JWT) || '',
                "from": from,
                "to": type == "to" ? chatName : '',
                "group": type == "group" ? chatName : '',
            }
        });
        const data = await response.json();
        console.log(data);

        return data
    }

    private connectWS() {

        const token = localStorage.getItem(AUTH_DATA_JWT) || '';
        const jwtPayloadJSON = atob(token.split('.')[1]);
        const jwtPayloadObj = JSON.parse(jwtPayloadJSON);
        const userName = jwtPayloadObj.sub;

        this.webSocket = new WebSocket(`${this.urlWebSocket}/${userName}`, localStorage.getItem(AUTH_DATA_JWT) || '');
        this.webSocket.onopen = () => {
            console.log('websocket connected');
        }

        this.webSocket.onmessage = message => { // listener
            console.log(message.data);
            this.chatSubscriberNext(message.data);
        }
        //
    }

    private disconnectWS(): void {
        this.webSocket?.close();
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