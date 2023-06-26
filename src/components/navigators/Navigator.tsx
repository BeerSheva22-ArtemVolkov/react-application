import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
export type RouteType = {
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({ routes }) => {

    const navigate = useNavigate() // используется для изменения состояние активного раута (похож на диспатч). 
    // useEffect: туда передается функция, которая будет вызываться при монтировании или изменении зависимости
    const location = useLocation();// useSelector дает измененное значение состояние. (дает текущий путь из адресной строки)   
    //useLocation дает измененное состояние раута (дает активный раут)
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname)
        if (index < 0) {
            index = 0;
        }        
        navigate(routes[index].to);
    }, [routes])

    return <div >
        <nav>
            <ul className="navigator-list">
                {routes.map(route => <li key={route.label} className="navigator-item">
                    <NavLink to={route.to}>{route.label}</NavLink> 
                </li>)}
            </ul>
        </nav>
        <Outlet></Outlet>
    </div>
}
export default Navigator;