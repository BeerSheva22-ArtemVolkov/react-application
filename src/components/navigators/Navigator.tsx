import { FormEventHandler, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

const ADMIN: string = 'admin';
const USER: string = 'user';
const NOBODY: string = ''

const Navigator: React.FC = () => {

    const [userName, setUserName] = useState<string>('')
    const [userType, setUserType] = useState<string>(NOBODY)

    const signInHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (userName.toLocaleLowerCase().startsWith('admin')) {
            setUserType(ADMIN)
        } else {
            setUserType(USER)
        }
    }

    const signOutHandler = () => {
        setUserName('')
        setUserType(NOBODY)
    }

    return <div>
        <input
            placeholder="user name"
            value={userName}
            onChange={event => { setUserName(event.target.value) }}
        />

        <nav>
            <ul className="navigator-list">
                {userType == ADMIN && <li className="navigator-item">
                    <NavLink to="customers">Customers</NavLink>
                </li>}
                {userType == ADMIN && <li className="navigator-item">
                    <NavLink to="orders">Orders</NavLink>
                </li>}
                {userType && <li className="navigator-item">
                    <NavLink to="products">Products</NavLink>
                </li>}
                {userType == USER && <li className="navigator-item">
                    <NavLink to="shoppingcart">Shopping cart</NavLink>
                </li>}
                {!userType && <li className="navigator-item">
                    <NavLink to="signin" onClick={signInHandler}>Sign In</NavLink>
                </li>}
                {userType && <li className="navigator-item">
                    <NavLink to="signout" onClick={signOutHandler}>Sign Out</NavLink>
                </li>}

            </ul>
        </nav>
        <div>
            <label>{userName && userType != NOBODY ? `Hi, ${userName}` : '' }</label>
        </div>
        {/* Компонент Outlet позволяет вложенным маршрутам отображать их element содержимое и все остальное, что отображается маршрутом компоновки, то есть навигационные панели, боковые панели, конкретные компоненты компоновки и т.д. */}
        {/* context будет отображать значение во всех дочерних Route если использовть useOutletContext */}
        <Outlet context={{ name: 'Artem' }} />
    </div>
}

export default Navigator