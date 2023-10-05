import { useDispatch } from "react-redux";
import { authService } from "../../config/service-config";
import { authActions } from "../../redux/slices/authSlice";
import { useDispatchCode } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../forms/RegistrationForm";
import UserData from "../../model/UserData";
import LoginData from "../../model/LoginData";

const Registration: React.FC = () => {

    const dispatch = useDispatch();
    const dispatchCode = useDispatchCode()
    const navigate = useNavigate()

    async function submitFn(loginData: LoginData): Promise<void> {

        let successMessage: string = ''
        let errorMessage: string = ''
        let res: UserData | string = ''

        try {
            res = await authService.registration(loginData);
            console.log(res);

            typeof res == 'object' && dispatch(authActions.set(res));
            console.log(res);

            if (typeof res == 'string') {
                errorMessage = res
            } else {
                successMessage = "Registration success"
                const user = await authService.login(loginData)
            }
        } catch (error: any) {
            console.log(error);

            errorMessage = error.message
        }

        dispatchCode(errorMessage, successMessage)
        // if (successMessage && typeof res == 'object') {
        //     navigate('/')
        // }
    }

    return (
        <RegistrationForm submitFn={submitFn}></RegistrationForm>
        // <RegistrationForm></RegistrationForm>
    )
}

export default Registration