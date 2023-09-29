import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
// import Employee from "../model/Employee"; 
import { Subscription } from "rxjs";
import { chatRoomService } from "../config/service-config";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';

        if (error.includes('Authentication')) {
            code = CodeType.AUTH_ERROR;
            message = "Authentication error, mooving to Sign In";
        } else {
            code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
            message = error;
        }
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}

export function useSelectorEmployees() {
    const dispatch = useDispatchCode();
    const [newMessage, setNewMessage] = useState<String>('');

    useEffect(() => {
        const subscription: Subscription = chatRoomService.getNewewst()
            .subscribe({
                next(message: string) {
                    let errorMessage: string = '';
                    setNewMessage(message);
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return newMessage;
}

export function useSelectorActiveUsers() {
    const dispatch = useDispatchCode();
    const [activeUsers, setActiveUsers] = useState<any[]>([]);

    useEffect(() => {
        const subscription: Subscription = chatRoomService.getActive()
            .subscribe({
                next(users: any[]) {
                    let errorMessage: string = '';
                    setActiveUsers(users);
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return activeUsers;
}

// export function useSelectorChats() {
//     const dispatch = useDispatchCode();
//     const [groups, setGroups] = useState<string>('');

//     useEffect(() => {
//         const subscription: Subscription = employeesService.getNewewst()
//             .subscribe({
//                 next(message: string) {
//                     let errorMessage: string = '';
//                     setGroups(message);
//                     dispatch(errorMessage, '');
//                 }
//             });
//         return () => subscription.unsubscribe();
//     }, []);
//     return groups;
// }