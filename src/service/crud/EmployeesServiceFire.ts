import { Observable, catchError, of } from "rxjs";
import Employee from "../../model/Employee";
import EmployeesService from "./EmployeesService";
import appFirebase from '../../config/firebase-config' // информационная связь с Firebase
import { CollectionReference, DocumentReference, getFirestore, collection, getDoc, setDoc, deleteDoc, doc, FirestoreError } from 'firebase/firestore'
import { collectionData } from 'rxfire/firestore' // обеспечивает связь с rxjs?
import { getRandomInt } from "../../util/random";
import { getISODateStr } from "../../util/date-functions";

const MIN_ID = 100000
const MAX_ID = 1000000

// бд состоит из коллекции, коллекция из доков
// инициализация с проектом осущ через appFirebase

function convertEmployee(employee: Employee, id?: string): Employee {
    const res: any = {
        ...employee,
        id: id ? id : employee.id,
        birthDate: getISODateStr(employee.birthDate)
    }
    return res;
}

function getErrorMessage(firestoreError: FirestoreError): string {
    let errorMessage = ''
    switch (firestoreError.code) {
        case 'unauthenticated':
        case 'permission-denied': errorMessage = 'Authentication';
            break;
        default: errorMessage = firestoreError.message
    }
    return errorMessage
}

export default class EmployeesServiceFire implements EmployeesService {

    collectionRef: CollectionReference = collection(getFirestore(appFirebase), 'employees') // getFirestore - получить бд

    async addEmployee(empl: Employee): Promise<Employee> {

        const id: string = await this.getId()
        const employee: Employee = convertEmployee(empl, id)
        const docRef: DocumentReference = this.getDocRef(id)
        try {
            await setDoc(docRef, employee)
        } catch (error: any) {
            const firestoreError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestoreError)
            throw errorMessage
        }
        return employee
    }

    getEmployees(): Observable<string | Employee[]> {
        return collectionData(this.collectionRef).pipe(catchError(error => {
            const firestoreError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestoreError)
            return of(errorMessage) // позволяет не закрывать "стрим" observable (кастинг Observable<string>)
        })) as Observable<string | Employee[]>
    }

    async deleteEmployee(id: any): Promise<void> {

        const docRef: DocumentReference = this.getDocRef(id);

        if (!id && !await this.exists(id)) {
            throw 'not found'
        }

        try {
            await deleteDoc(docRef)
        } catch (error: any) {
            const firestoreError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestoreError)
            throw errorMessage
        }
    }

    async updateEmployee(empl: Employee): Promise<Employee> {

        const docRef: DocumentReference = this.getDocRef(empl.id)
        const employee = convertEmployee(empl);

        if (!empl.id && !await this.exists(empl.id)) {
            throw 'not found'
        }
        
        try {
            await setDoc(docRef, employee)
        } catch (error: any) {
            const firestoreError: FirestoreError = error;
            const errorMessage = getErrorMessage(firestoreError)
            throw errorMessage
        }
        return empl
    }


    private getDocRef(id: string): DocumentReference {
        return doc(this.collectionRef, id) // возвращает ссылку на информациооный объект
    }

    private async exists(id: string): Promise<boolean> {
        const docRef: DocumentReference = this.getDocRef(id)
        const docSnap = await getDoc(docRef) // объект из массива
        return docSnap.exists()
    }

    private async getId(): Promise<string> {
        let id: string = '';
        do {
            id = getRandomInt(MIN_ID, MAX_ID).toString()
        } while (await this.exists(id))
        return id
    }

}