import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouteType } from "./components/navigators/Navigator";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import { useSelectorAuth, useSelectorCode } from "./components/redux/store";
import { useEffect, useMemo, useState } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import NavigatorDispathcer from "./components/navigators/NavigatorDispatcher";
import UserData from "./model/UserData";
import Employees from "./components/pages/Employees";
import AddEmployee from "./components/pages/AddEmployee";
import AgeStatitics from "./components/pages/AgeStatitics";
import SalaryStatitics from "./components/pages/SalaryStatitics";
import GenerateEmployees from "./components/pages/GenerateEmployees";
import { Snackbar, Alert } from "@mui/material";
import CodeType from "./model/CodeType";
import CodePayload from "./model/CodePayload";
import { StatusType } from "./model/StatusType";
import { authActions } from "./components/redux/slices/authSlice";
import { authService } from "./config/service-config";
import { useDispatch } from "react-redux";
import { codeActions } from "./components/redux/slices/codeSlice";

const { always, authenticated, admin, noadmin, noauthenticated } = routesConfig;
type RouteTypeOrder = RouteType & { order?: number }

// function codeProcessing(code: CodePayload): any[] {
//     const res: any[] = [code.message, code.code === CodeType.OK ? "success" : "error"]
//     return res;
// }

function getRoutes(userData: UserData): RouteType[] {

    const res: RouteTypeOrder[] = [];
    res.push(...always);

    if (userData) {
        res.push(...authenticated)
        if (userData.role === 'admin') {
            res.push(...admin);
        } else {
            res.push(...noadmin);
        }
    } else {
        res.push(...noauthenticated);
    }

    res.sort((r1, r2) => {
        let res = 0;
        if (r1.order && r2.order) {
            res = r1.order - r2.order
        }
        return res
    });

    if (userData) {
        res[res.length - 1].label = userData.email
    }

    return res
}

const App: React.FC = () => {

    const userData: UserData = useSelectorAuth();
    const code: any = useSelectorCode(); //
    const dispatch = useDispatch();

    const routes = useMemo(() => getRoutes(userData), [userData])
    let [alertMessage, severity] = useMemo(() => codeProcessing(), [code])

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

    // BrowserRouter - это реализация маршрутизатора, для синхронизации пользовательского интерфейса с URL. Это родительский компонент, используемый для хранения всех других компонентов.
    return <BrowserRouter>
        <Routes>
            {/* Route - это условно отображаемый компонент, который предоставляет пользовательский интерфейс, когда его путь совпадает с текущим URL. */}
            <Route path="/" element={<NavigatorDispathcer routes={routes} />}>
                {/* index - основной подмаршрут */}
                <Route index element={<Employees user={userData} />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/generate" element={<GenerateEmployees />} />
                <Route path="statistics/age" element={<AgeStatitics />} />
                <Route path="statistics/salary" element={<SalaryStatitics />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signout" element={<SignOut />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
        <Snackbar open={!!alertMessage} autoHideDuration={5000} onClose={() => dispatch(codeActions.reset())}>
            <Alert onClose={() => dispatch(codeActions.reset())} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
    </BrowserRouter>

}

export default App;