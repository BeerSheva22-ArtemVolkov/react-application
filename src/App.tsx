import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigatorDispatcher from "./components/navigators/NavigatorDispatcher";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import { RouteType } from "./components/navigators/Navigator";
import UserData from "./model/UserData";
import Chats from "./components/pages/Chats";
import { StatusType } from "./model/StatusType";
import CodeType from "./model/CodeType";
import { useDispatch } from "react-redux";
import { authActions } from "./redux/slices/authSlice";
import { authService } from "./config/service-config";
import { Alert, Drawer, Snackbar } from "@mui/material";
import { codeActions } from "./redux/slices/codeSlice";
import Registration from "./components/pages/Registration";
import Admin from "./components/pages/Admin";

const { always, authenticated, admin, noadmin, noauthenticated, development } = routesConfig;
type RouteTypeOrder = RouteType & { order?: number }

function getRoutes(userData: UserData): RouteType[] {
    const res: RouteTypeOrder[] = [];
    res.push(...always);
    if (userData) {
        res.push(...authenticated);
        if (userData.role === 'admin') {
            res.push(...admin)
            if (process.env.NODE_ENV == "development") {
                res.push(...development)
            }
        } else {
            res.push(...noadmin)
        }
    } else {
        res.push(...noauthenticated);
    }
    res.sort((r1, r2) => {
        let res = 0;
        if (r1.order && r2.order) {
            res = r1.order - r2.order;
        }
        return res
    });
    if (userData) {
        res[res.length - 1].label = userData.email;
    }
    return res
}
const App: React.FC = () => {
    const userData = useSelectorAuth();
    const code = useSelectorCode();
    const dispatch = useDispatch();

    const [alertMessage, severity] = useMemo(() => codeProcessing(), [code]);
    const routes = useMemo(() => getRoutes(userData), [userData]);

    function codeProcessing(): [string, StatusType] {
        const res: [string, StatusType] = [code.message, 'success'];

        switch (code.code) {
            case CodeType.OK: res[1] = 'success'; break;
            case CodeType.SERVER_ERROR: res[1] = 'error'; break;
            case CodeType.UNKNOWN: res[1] = 'error'; break;
            case CodeType.AUTH_ERROR: res[1] = 'error';
                dispatch(authActions.reset());
                authService.logout()
        }

        return res;
    }
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<NavigatorDispatcher routes={routes} />}>
                <Route index element={<Chats />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="registration" element={<Registration />} />
                <Route path="signout" element={<SignOut />} />
                <Route path="admin" element={<Admin />} />
                <Route path="/*" element={<NotFound />} />
            </Route>
        </Routes>
        <Snackbar open={!!alertMessage} autoHideDuration={20000}
            onClose={() => dispatch(codeActions.reset())}>
            <Alert onClose={() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
    </BrowserRouter>
}
export default App;