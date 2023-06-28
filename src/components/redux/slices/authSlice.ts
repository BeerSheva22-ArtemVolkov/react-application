import { createSlice } from '@reduxjs/toolkit';
import UserData from '../../../model/UserData';
const AUTH_ITEM = "auth-item"

function getUserData(storageValue: string | null): UserData | null {
    let email: string = ''
    let role: string = ''

    if (storageValue) {
        const payloadJson = atob(storageValue!.split('.')[1])
        const userData = JSON.parse(payloadJson);
        email = userData.email;
        role = userData.sub;
        return { email, role }
    } else {
        return null
    }
}

const initialState: UserData | null = getUserData(localStorage.getItem(AUTH_ITEM)) ? {email: getUserData(localStorage.getItem(AUTH_ITEM))!.email,
    role: getUserData(localStorage.getItem(AUTH_ITEM))!.role} : null

const authSlice = createSlice({
    initialState,
    name: "authState",
    reducers: {
        set: (state, data) => {
            console.log(data);
            
            state = getUserData(data.payload)
            localStorage.setItem(AUTH_ITEM, data.payload)
        },
        reset: (state: UserData | null) => {
            state = null
            localStorage.removeItem(AUTH_ITEM)
        }
    }
})
export const authActions = authSlice.actions // чтобы менять
export const authReducer = authSlice.reducer // чтобы брать