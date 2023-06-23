import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Navigator from "./components/navigators/Navigator";
import Home from "./components/pages/Home";
import Customers from "./components/pages/Customers";
import Orders from "./components/pages/Orders";
import Products from "./components/pages/Products";
import ShoppingCart from "./components/pages/ShoppingCart";
import SignIn from "./components/pages/SignIn";
import SignOut from "./components/pages/SignOut";
import './App.css'
import Test from "./components/pages/Test";

const App: React.FC = () => {

  // BrowserRouter - это реализация маршрутизатора, для синхронизации вашего пользовательского интерфейса с URL. Это родительский компонент, используемый для хранения всех других компонентов.
  return <BrowserRouter>
    <Routes>
      {/* Route - это условно отображаемый компонент, который предоставляет пользовательский интерфейс, когда его путь совпадает с текущим URL. */}
      <Route path="/" element={<Navigator />}>
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
      </Route>
    </Routes>

  </BrowserRouter>

}

export default App;