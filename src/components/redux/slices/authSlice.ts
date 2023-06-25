import { createSlice } from '@reduxjs/toolkit';
const AUTH_ITEM = "auth-item"
const initialState: { username: string } = {
    username: localStorage.getItem(AUTH_ITEM) || ''
}

const authSlice = createSlice({
    initialState,
    name: "authState",
    reducers: {
        set: (state, data) => {
            state.username = data.payload;
            localStorage.setItem(AUTH_ITEM, data.payload)
        },
        reset: (state) => {
            state.username = ''
            localStorage.removeItem(AUTH_ITEM)
        }

    }
})
export const authActions = authSlice.actions
export const authReducer = authSlice.reducer