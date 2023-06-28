import { useDispatch } from "react-redux";
import Input from "../common/Input";
import InputResult from "../../model/InputResult";
import { authActions } from "../redux/slices/authSlice";
import SignInForm from "../forms/SignInForm";
import AuthServiceJWT from "../../service/AuthServiceJwt";
import UserData from "../../model/UserData";
const SignIn: React.FC = () => {
    // const dispatch = useDispatch();
    //FIXME - should work with real form and real auth service
    // return <Input submitFn={function (username: string): InputResult {
    //     setTimeout(() => dispatch(authActions.set(username)), 5000);
    //     return { status: "success", message: username }
    // }} placeholder="username" />

    const authService: AuthServiceJWT = new AuthServiceJWT('http://localhost:3500/login')

    const submitFn = async (email: string, password: string): Promise<InputResult> => {
        
        const response = await authService.login({ email, password })

        if (response?.accessToken) {
            return { status: "success", message: response.accessToken }
        } else {
            return { status: "error", message: response }
        }

    }

    return (
        <SignInForm submitFn={submitFn} ></SignInForm>
    )
}

export default SignIn;