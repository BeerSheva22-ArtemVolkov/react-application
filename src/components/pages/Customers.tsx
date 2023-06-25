import { NavLink, Outlet, useOutletContext } from "react-router-dom";

interface test {
    name: string
}

const Customers: React.FC = () => {

    const context:test = useOutletContext();

    return (<>
        <p className="component-logo">Customers component</p>
        <nav>
            <ul className="navigator-list">
                <li className="navigator-item">
                    <NavLink to="test">Test</NavLink>
                </li>
            </ul>
        </nav>
        <Outlet></Outlet>
    </>)
}
export default Customers;