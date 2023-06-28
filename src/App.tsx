import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouteType } from "./components/navigators/Navigator";
import Home from "./components/pages/Home";
import Customers from "./components/pages/Customers";
import Orders from "./components/pages/Orders";
import Products from "./components/pages/Products";
import ShoppingCart from "./components/pages/ShoppingCart";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import Test from "./components/pages/Test";
import './App.css'
import { useSelectorAuth } from "./components/redux/store";
import { useMemo } from "react";
import routesConfig from './config/routes-config.json';
import NotFound from "./components/pages/NotFound";
import NavigatorDispathcer from "./components/navigators/NavigatorDispatcher";
import UserData from "./model/UserData";

const { always, authenticated, admin, noadmin, noauthenticated } = routesConfig;
function getRoutes(user: UserData): RouteType[] {
  const res: RouteType[] = [];
  res.push(...always);
  user && res.push(...authenticated);
  user && user.role.startsWith('admin') && res.push(...admin);
  user && user.email && !user.role.startsWith('admin') && res.push(...noadmin);
  !user && res.push(...noauthenticated);
  return res;
}

const App: React.FC = () => {

  const user: UserData | null = useSelectorAuth();
  
  const routes = useMemo(() => getRoutes(user), [user])

  // BrowserRouter - это реализация маршрутизатора, для синхронизации пользовательского интерфейса с URL. Это родительский компонент, используемый для хранения всех других компонентов.
  return <BrowserRouter>
    <Routes>
      {/* Route - это условно отображаемый компонент, который предоставляет пользовательский интерфейс, когда его путь совпадает с текущим URL. */}
      <Route path="/" element={<NavigatorDispathcer routes={routes} />}>
        {/* index - основной подмаршрут */}
        <Route index element={<Home />} />
        <Route path="customers" element={<Customers />} >
          <Route path="test" element={<Test />} />
        </Route>
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="shoppingcart" element={<ShoppingCart />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signout" element={<SignOut />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>

  </BrowserRouter>

}

export default App;