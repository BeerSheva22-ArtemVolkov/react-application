import { NavLink, Outlet, useOutletContext } from "react-router-dom";

interface test {
    name: string
}

const Customers: React.FC = () => {

    const context:test = useOutletContext();

    return (<>
        <p className="component-logo">Customers component {context.name}</p>
        <nav>
            <ul className="navigator-list">
                <li className="navigator-item">
                    {/* NavLink определяет активную вкладку */}
                    <NavLink to="test">Test</NavLink>
                </li>
            </ul>
        </nav>
        <Outlet></Outlet>
    </>)
}
export default Customers;