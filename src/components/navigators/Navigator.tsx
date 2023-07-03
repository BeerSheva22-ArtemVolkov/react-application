import { AppBar, Link, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

export type RouteType = {
    to: string, label: string
}

const Navigator: React.FC<{ routes: RouteType[] }> = ({ routes }) => {

    const navigate = useNavigate() // используется для изменения состояние активного раута (похож на диспатч). 
    // useEffect: туда передается функция, которая будет вызываться при монтировании или изменении зависимости
    const location = useLocation();// useSelector дает измененное значение состояние. (дает текущий путь из адресной строки)   
    //useLocation дает измененное состояние раута (дает активный раут)
    const [value, setValue] = useState(0)
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname)
        if (index < 0) {
            index = 0;
        }
        navigate(routes[index].to);
        setValue(index)
    }, [routes])

    function onChangeFn(event: any, newValue: number) {
        setValue(newValue)
    }

    function getTabs(): ReactNode {
        return routes.map(route => <Tab component={NavLink} to={route.to} label={route.label} key={route.label} />)
    }

    return <Box mt={10}>
        {/* sx - style extended? */}
        <AppBar sx={{ backgroundColor: 'lightgray' }}>
            <Tabs value={value < routes.length ? value : 0} onChange={onChangeFn}>
                {getTabs()}
            </Tabs>
        </AppBar>
        <Outlet></Outlet>
    </Box>
}

export default Navigator;