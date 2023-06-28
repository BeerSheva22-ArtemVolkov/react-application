import { useDispatch } from "react-redux";
import InputResult from "../../model/InputResult";
import SignInForm from "../forms/SignInForm";
import LoginData from "../../model/LoginData";
import { authService } from "../../config/service-config";
import { authActions } from "../redux/slices/authSlice";
const SignIn: React.FC = () => {

    const dispatch = useDispatch()

    async function submitFn(loginData: LoginData): Promise<InputResult> {

        const res = await authService.login(loginData)        
        res && dispatch(authActions.set(res));
        return { status: res ? "success" : "error", message: res ? '' : 'incorrect credentials'}
    }

    return (
        <SignInForm submitFn={submitFn} ></SignInForm>
    )
}

export default SignIn;