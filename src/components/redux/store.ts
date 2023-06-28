import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        authState: authReducer
    }
});

export function useSelectorAuth() {
    console.log('auth');
    
    return useSelector<any, string>(state => state.authState.username);
}