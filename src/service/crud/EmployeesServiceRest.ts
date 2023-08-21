import { Observable, Subscriber } from "rxjs";
import Employee from "../../model/Employee";
import { AUTH_DATA_JWT } from "../auth/AuthServiceJwt";
import EmployeesService from "./EmployeesService";
import { CompatClient, Stomp } from "@stomp/stompjs";
import NotifierType from "../../model/NotifierType";

const TOPIC: string = "/topic/employees"

class Cache {

    private cache: Map<number, Employee> = new Map();

    addToCache(id: number, empl: Employee) {
        this.cache.set(id, empl);
    }

    deleteFromCache(id: number) {
        this.cache.delete(id);
    }

    updateCache(id: number, empl: Employee) {
        console.log(id, empl);
        
        this.cache.set(id, empl);
    }

    setCache(empls: Employee[]) {
        empls.forEach(empl => this.cache.set(empl.id, empl));
    }

    clearCache() {
        this.cache = new Map();
    }

    getCache(): Employee[] {
        return Array.from(this.cache.values());
    }

    isEmpty(): Boolean {
        return this.cache.size == 0;
    }

}

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

async function fetchRequest(url: string, options: RequestInit, empl?: Employee): Promise<Response> {
    options.headers = getHeaders();
    if (empl) {
        options.body = JSON.stringify(empl);
    }

    let flUpdate = true;
    let responseText = '';
    try {
        if (options.method == "DELETE" || options.method == "PUT") {
            flUpdate = false;
            await fetchRequest(url, { method: "GET" });
            flUpdate = true;
        }

        const response = await fetch(url, options);
        responseText = await getResponseText(response);
        if (responseText) {
            throw responseText;
        }
        return response;
    } catch (error: any) {
        if (!flUpdate) {
            throw error;
        }
        throw responseText ? responseText : "Server is unavailable. Repeat later on";
    }
}
async function fetchAllEmployees(url: string): Promise<Employee[] | string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class EmployeesServiceRest implements EmployeesService {

    private observable: Observable<Employee[] | string> | null = null;
    private subscriber: Subscriber<string | Employee[]> | undefined;
    private urlService: string;
    private urlWebSocket: string;
    private stompClient: CompatClient;
    private cache: Cache;

    constructor(baseUrl: string) {
        this.urlService = `http://${baseUrl}/employees`
        this.urlWebSocket = `ws://${baseUrl}/websocket/employees`
        this.stompClient = Stomp.client(this.urlWebSocket);
        this.cache = new Cache;
    }

    async updateEmployee(empl: Employee): Promise<Employee> {
        const response = await fetchRequest(this.getUrlWithId(empl.id!),
            { method: 'PUT' }, empl);
        return await response.json();
    }

    private getUrlWithId(id: any): string {
        return `${this.urlService}/${id}`;
    }

    private subscriberNext(): void {
        fetchAllEmployees(this.urlService).then(employees => {
            this.subscriber?.next(employees);
            this.cache.setCache(employees as Employee[]);
        }).catch(error => this.subscriber?.next(error));
    }

    async deleteEmployee(id: any): Promise<void> {
        await fetchRequest(this.getUrlWithId(id), {
            method: 'DELETE',
        });
    }

    getEmployees(): Observable<Employee[] | string> {
        if (!this.observable) {
            this.observable = new Observable<Employee[] | string>(subscriber => {
                this.subscriber = subscriber;
                this.subscriberNext();
                this.connectWS();
                return () => this.disconnectWS();
            })
        }
        return this.observable;
    }

    private connectWS() {

        this.stompClient.connect(
            {},
            () => {
                this.stompClient?.subscribe(TOPIC, message => {
                    const notifierObj: NotifierType = JSON.parse(message.body)
                    
                    switch (notifierObj.actionType) {
                        case "ADD":
                            this.cache.addToCache(notifierObj.object.id, notifierObj.object as Employee)
                            break; 
                        case "DELETE":
                            this.cache.deleteFromCache(notifierObj.object)
                            break;
                        case "UPDATE":
                            this.cache.updateCache(notifierObj.object.id, notifierObj.object as Employee)
                            break;
                        default:
                            break;
                    }                    
                    this.subscriber?.next(this.cache.getCache());
                })
            },
            (error: any) => this.subscriber?.next(JSON.stringify(error)),
            () => console.log("websocket disconnected")
        );
    }

    private disconnectWS(): void {
        this.stompClient?.disconnect();
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const response = await fetchRequest(this.urlService, {
            method: 'POST',
        }, empl);
        return response.json();
    }

}