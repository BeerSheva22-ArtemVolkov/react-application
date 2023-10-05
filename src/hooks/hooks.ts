import { useDispatch } from "react-redux";
import CodeType from "../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { chatRoomService } from "../config/service-config";
import MessageType from "../model/MessageType";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (errorMessage: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = successMessage;

        if (errorMessage) {
            if (errorMessage.includes('Authentication')) {
                code = CodeType.AUTH_ERROR;
                message = "Authentication error, mooving to Sign In";
            } else {
                code = errorMessage.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
                message = errorMessage;
            }
        }

        dispatch(codeActions.set({ code, message }))
    }
}

export function useSelectorNewMessage() {
    const dispatch = useDispatchCode();
    const [newMessage, setNewMessage] = useState<MessageType>();

    useEffect(() => {
        const subscription: Subscription = chatRoomService.getNewewst()
            .subscribe({
                next(message: MessageType) {
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