import { Observable, Subscriber } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";
import Employees from "../components/pages/Employees";

const POLLER_INTERVAL = 2000;

class Cache {

    cacheString: string = ''

    setCache(employees: Employee[]): void {
        this.cacheString = JSON.stringify(employees)
    }

    reset(): void {
        this.cacheString = ''
    }

    isEqual(employees: Employee[]): boolean {
        return this.cacheString === JSON.stringify(employees);
    }

    getCache(): Employee[] {
        return !this.isEmplty() ? JSON.parse(this.cacheString) : []
    }

    isEmplty(): boolean {
        return this.cacheString.length == 0
    }
}

export default class EmployeesServiceRest implements EmployeesService {

    private observable: Observable<Employee[] | string> | null = null
    private cache: Cache = new Cache()

    constructor(private url: string) { }

    async addEmployee(employee: Employee): Promise<Employee> {
        return this.sendRequest("POST", '', JSON.stringify({ ...employee, userId: "admin" }))
    }

    getEmployees(): Observable<Employee[] | string> {

        if (this.observable == null) {
            this.observable = new Observable<Employee[] | string>((subscriber) => {
                if (this.cache.isEmplty()) {
                    // Запрос
                    try {
                        this.startEmployeesSubscription(subscriber)
                    } catch (error: any) {
                        subscriber.next(error)
                    }
                } else {
                    // восстановление из кэша
                    subscriber.next(this.cache.getCache())
                    console.log('Restored from cache');
                }
                const intervalID = setInterval(() => this.startEmployeesSubscription(subscriber), POLLER_INTERVAL)
                return () => clearInterval(intervalID);
            })
        }
        return this.observable
    }

    async deleteEmployee(employeeID: any): Promise<void> {
        await this.sendRequest("DELETE", `/${employeeID}`)
    }

    async updateEmployee(employee: Employee): Promise<Employee> {
        return this.sendRequest("PUT", `/${employee.id}`, JSON.stringify({ ...employee, userId: "admin" }))
    }

    private async startEmployeesSubscription(subscriber: Subscriber<string | Employee[]>) {
        this.sendRequest("GET", '')
            .then(async (employees: Promise<Employee[]>) => {
                const empls = await employees;
                empls.map(employee => ({ ...employee, birthDate: new Date(employee.birthDate) }))
                return empls
            })
            .then(employees => {
                if (!this.cache.isEqual(employees)) {
                    this.cache.setCache(employees)
                    subscriber.next(employees)
                    console.log('new data');
                } else {
                    console.log('no changes in data');
                }
            })
    }

    private async sendRequest(method: string, path: string, body?: string): Promise<any> {

        const token = localStorage.getItem(AUTH_DATA_JWT);
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.url}${path}`, {
                method,
                headers,
                body
            })
            if (!response.ok) {
                throw this.getErrorMsg(response.status, response.statusText);
            }
            return response.json()
        } catch (error: any) {
            if (error instanceof Error) {
                throw "Server is unavailable, repeat later";
            } else {
                throw error;
            }
        }
    }

    private getErrorMsg(status: number, statusText: string): string {
        let errorMsg: string = ''
        switch (status) {
            case 403: {
                errorMsg = "Authentication";
                break;
            }
            case 404: {
                errorMsg = "Not found";
                break;
            }
            default: {
                errorMsg = statusText
            }
        }

        return errorMsg
    }

}