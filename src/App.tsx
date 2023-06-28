import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Navigator, { RouteType } from "./components/navigators/Navigator";
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

const { always, authenticated, admin, noadmin, noauthenticated } = routesConfig;
function getRoutes(username: string): RouteType[] {
  console.log('remder routes');
  
  const res: RouteType[] = [];
  res.push(...always);
  username && res.push(...authenticated);
  username.startsWith('admin') && res.push(...admin);
  username && !username.startsWith('admin') && res.push(...noadmin);
  !username && res.push(...noauthenticated);
  return res;
}

const App: React.FC = () => {

  const userName = useSelectorAuth();
  const routes = useMemo(() => getRoutes(userName), [userName]) // вызывается в момент рендеринга и не вызовется при повторном перерендеринге, если не изменился userName

  // BrowserRouter - это реализация маршрутизатора, для синхронизации пользовательского интерфейса с URL. Это родительский компонент, используемый для хранения всех других компонентов.
  return <BrowserRouter>
    <Routes>
      {/* Route - это условно отображаемый компонент, который предоставляет пользовательский интерфейс, когда его путь совпадает с текущим URL. */}
      <Route path="/" element={<Navigator routes={routes} />}>
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