import { useDispatch } from 'react-redux';
import { authActions } from '../redux/slices/authSlice';
import { authService } from '../../config/service-config';

const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    return <button onClick={async () => {
        dispatch(authActions.reset())
        const res = await authService.logout()
    }
    }>confirm sign out</button>
}

export default SignOut;