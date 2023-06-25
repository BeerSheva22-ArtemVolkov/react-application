import { NavLink, Outlet} from 'react-router-dom'
export type RouteType = {
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({routes}) => {
    
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