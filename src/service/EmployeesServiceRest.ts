import { Observable } from "rxjs";
import Employee from "../model/Employee";
import { AUTH_DATA_JWT } from "./AuthServiceJwt";
import EmployeesService from "./EmployeesService";
import { subscribe } from "diagnostics_channel";

export default class EmployeesServiceRest implements EmployeesService {

    constructor(private url: string) { }

    async addEmployee(empl: Employee): Promise<Employee> {
        let responseText = '';
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
                },
                body: JSON.stringify({ ...empl, userId: 'admin' })
            });
            if (!response.ok) {
                const { status, statusText } = response;
                responseText = status == 401 || status == 403 ? 'Authentication' : statusText;
                throw responseText;
            }
            return await response.json();
        } catch (error: any) {
            throw responseText ? responseText : "Server is unavailable. Repeat later on";
        }
    }

    getEmployees(): Observable<Employee[] | string> {
        return new Observable<Employee[] | string>((subscriber) => {
            fetch(this.url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(AUTH_DATA_JWT) || ''}`
                },
            })
                .then(async response => {
                    let res: Promise<Employee[] | string>;
                    if (response.ok) {
                        res = response.json();
                    } else {
                        res = Promise.resolve(response.status == 401 || response.status == 403 ? 'Authentication' : response.statusText)
                    }
                    return res
                })
                .then(data => subscriber.next(data))
                .catch(error => subscriber.next('Server is unavailable, repeate later'))
        })
    }


}
