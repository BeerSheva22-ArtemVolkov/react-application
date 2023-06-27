import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, Toolbar, Typography, Tab } from "@mui/material";
import { RouteType } from "./Navigator";
import { Outlet, useLocation, useNavigate } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink } from "react-router-dom";

const NavigatorPortrait: React.FC<{ routes: RouteType[] }> = ({ routes }) => {

    const navigate = useNavigate()
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [menuName, setMenuName] = useState<string>('')

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function updateMenuName(menuName: string) {
        handleDrawerClose();
        setMenuName(menuName)
    }

    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname)
        if (index < 0) {
            index = 0;
        }
        navigate(routes[index].to);
        setMenuName(routes[index].label)
    }, [routes])

    return <Box mt={10}>
        <AppBar sx={{ backgroundColor: 'lightgray' }}>
            <Toolbar>
                <IconButton
                    color="primary"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
                <Box flexGrow={1}>
                    <Typography variant="h4" noWrap component="p" color={"black"} align="center">
                        {menuName}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
        >
            <IconButton onClick={handleDrawerClose}>
                <ChevronRightIcon />
            </IconButton>
            <List>
                {routes.map(route => (
                    <ListItem key={route.label} disablePadding>
                        <ListItemButton>
                            <Tab component={NavLink} to={route.to} label={route.label} key={route.label} value={route.label} onClick={updateMenuName.bind(undefined, route.label)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
        <Outlet></Outlet>
    </Box>
}

export default NavigatorPortrait;