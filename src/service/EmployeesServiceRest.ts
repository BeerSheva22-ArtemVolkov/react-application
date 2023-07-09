import { Observable, Subscriber } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";
const POLLER_INTERVAL = 3000;
class Cache {
    cacheString: string = '';
    set(employees: Employee[]): void {
        this.cacheString = JSON.stringify(employees);
    }
    reset() {
        this.cacheString = ''
    }
    isEqual(employees: Employee[]): boolean {
        return this.cacheString === JSON.stringify(employees)
    }
    getCache(): Employee[] {
        return !this.isEmpty() ? JSON.parse(this.cacheString) : []
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
}
function getResponseText(response: Response): string {
    let res = '';
    if (!response.ok) {
        const { status, statusText } = response;
        res = status == 401 || status == 403 ? 'Authentication' : statusText;
    }
    return res;

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
            await fetchRequest(url, {method: "GET"});
            flUpdate = true;
        }

        const response = await fetch(url, options);
        responseText = getResponseText(response);
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
async function fetchAllEmployees(url: string):Promise< Employee[]|string> {
    const response = await fetchRequest(url, {});
    return await response.json()
}

export default class EmployeesServiceRest implements EmployeesService {
    private observable: Observable<Employee[] | string> | null = null;
    private cache: Cache = new Cache();
    constructor(private url: string) { }
    async updateEmployee(empl: Employee): Promise<Employee> {
        const response = await fetchRequest(this.getUrlWithId(empl.id!),
            { method: 'PUT' }, empl);

        return await response.json();

    }
    private getUrlWithId(id: any): string {
        return `${this.url}/${id}`;
    }
    private sibscriberNext(url: string, subscriber: Subscriber<Employee[] | string>): void {
        
        fetchAllEmployees(url).then(employees => {
            if (this.cache.isEmpty() || !this.cache.isEqual(employees as Employee[])) {
                this.cache.set(employees as Employee[]);
                subscriber.next(employees);
            }
            
        })
        .catch(error => subscriber.next(error));
    }
    async deleteEmployee(id: any): Promise<void> {
            const response = await fetchRequest(this.getUrlWithId(id), {
                method: 'DELETE',
            });
            return await response.json();
    }
    getEmployees(): Observable<Employee[] | string> {
        let intervalId: any;
        if (!this.observable) {
            this.observable = new Observable<Employee[] | string>(subscriber => {
                this.cache.reset();
                this.sibscriberNext(this.url, subscriber);
                intervalId = setInterval(() => this.sibscriberNext(this.url, subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observable;
    }
       
    async addEmployee(empl: Employee): Promise<Employee> {
       
            const response = await fetchRequest(this.url, {
                method: 'POST',
               }, {...empl, userId: "admin"} as any)
           ;
           return response.json();

    }

}