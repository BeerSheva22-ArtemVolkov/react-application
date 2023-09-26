import { AppBar, Avatar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField, Toolbar, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import { useState, useRef, useMemo, useEffect } from "react";
// import Employee from "../../model/Employee";
import { employeesService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { Delete, Edit, Man, Woman, Visibility, Send, ChevronRight, ChevronLeft } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import Message from "../common/Message";
// import { useDispatchCode } from "../../hooks/hooks";

const columnsCommon: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'name', headerName: 'Name', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    }
]

const columnsPortrait: GridColDef[] = [
    {
        field: 'birthDate', headerName: "Date", flex: 0.8, type: 'date', headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'department', headerName: 'Department', flex: 0.8, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'salary', headerName: 'Salary', type: 'number', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'gender', headerName: 'Gender', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center', renderCell: params => {
            return params.value == "male" ? <Man /> : <Woman />
        }
    },
];

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

let drawerWidth = 240

const Employees: React.FC = () => {

    const [open, setOpen] = useState<boolean>(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
        drawerWidth = open ? 240 : 60
    };

    // const columnsAdmin: GridColDef[] =
    //     [{
    //         field: 'actions', type: "actions", getActions: (params) => {
    //             return [
    //                 <GridActionsCellItem label="remove" icon={<Delete />}
    //                     onClick={() => removeEmployee(params.id)
    //                     } />,
    //                 <GridActionsCellItem label="update" icon={<Edit />}
    //                     onClick={() => {
    //                         employeeId.current = params.id as any;
    //                         if (params.row) {
    //                             const empl = params.row;
    //                             empl && (employee.current = empl);
    //                             setFlEdit(true)
    //                         }
    //                     }} />
    //             ];
    //         }
    //     }]

    // const columnDetails: GridColDef[] =
    //     [{
    //         field: 'details', type: "actions", headerName: 'Details', getActions: (params) => {
    //             return [
    //                 <GridActionsCellItem label="details" icon={<Visibility />}
    //                     onClick={() => {
    //                         employeeId.current = params.id as any;
    //                         if (params.row) {
    //                             const empl = params.row;
    //                             empl && (employee.current = empl);
    //                             setWatchMode(userData ? userData.role : '')
    //                             setFlWatch(true)
    //                         }
    //                     }} />
    //             ];
    //         }
    //     }]


    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const newestMessage = useSelectorEmployees();
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('md'));
    // const columns = useMemo(() => getColumns(), [userData, employees, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openWatch, setFlWatch] = useState(false);
    const [wsMessage, setWSMessage] = useState<String>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [personal, setPersonal] = useState<any[]>([]);

    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    // const employee = useRef<Employee | undefined>();
    const [watchMode, setWatchMode] = useState<string>('')

    useEffect(() => {
        employeesService.getGroups().then(group => {
            setGroups(group.groups)
            setPersonal(group.personal)
        });
    }, [])

    const [selectedChat, setSelectedChat] = useState<string>(groups[0])
    const [selectedChatType, setSelectedChatType] = useState<string>("group")
    const [filterFrom, setFilterFrom] = useState<string>('')
    const [includeFrom, setIncludeFrom] = useState<boolean>(false)

    useEffect(() => {
        employeesService.getFromChat(selectedChat, includeFrom, selectedChatType, filterFrom).then(messages => setMessages(messages));
    }, [newestMessage, selectedChat])


    // function getColumns(): GridColDef[] {
    //     let res: GridColDef[] = columnsCommon;
    //     if (!isPortrait) {
    //         res = res.concat(columnsPortrait);
    //         if (userData && userData.role == 'admin') {
    //             res = res.concat(columnsAdmin);
    //         }
    //     } else {
    //         res = res.concat(columnDetails);
    //     }

    //     return res;
    // }

    // function removeEmployee(id: any) {
    //     title.current = "Remove Employee object?";
    //     const employee = employees.find(empl => empl.id == id);
    //     content.current = `You are going remove employee with id ${employee?.id}`;
    //     employeeId.current = id;
    //     confirmFn.current = actualRemove;
    //     setOpenConfirm(true);
    // }

    // async function actualRemove(isOk: boolean) {
    //     let errorMessage: string = '';
    //     if (isOk) {
    //         try {
    //             await employeesService.deleteEmployee(employeeId.current);
    //         } catch (error: any) {
    //             errorMessage = error;
    //         }
    //     }
    //     dispatch(errorMessage, '');
    //     setOpenConfirm(false);
    // }

    // function updateEmployee(empl: Employee): Promise<InputResult> {
    //     setFlEdit(false)
    //     setFlWatch(false)

    //     const res: InputResult = { status: 'error', message: '' };
    //     if (JSON.stringify(employee.current) != JSON.stringify(empl)) {
    //         title.current = "Update Employee object?";
    //         employee.current = empl;
    //         content.current = `You are going update employee with id ${empl.id}`;
    //         confirmFn.current = actualUpdate;
    //         setOpenConfirm(true);
    //     }
    //     return Promise.resolve(res);
    // }

    // async function actualUpdate(isOk: boolean) {

    //     let errorMessage: string = '';

    //     if (isOk) {
    //         try {
    //             await employeesService.updateEmployee(employee.current!);
    //         } catch (error: any) {
    //             errorMessage = error
    //         }
    //     }
    //     dispatch(errorMessage, '');
    //     setOpenConfirm(false);
    // }

    return <Box sx={{ display: 'flex' }}>
        {/* <CssBaseline /> */}
        {/* <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Permanent drawer
                </Typography>
            </Toolbar>
        </AppBar> */}
        <Drawer
            // open={open}
            sx={{
                zIndex: 0,
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    overflowY: "inherit",
                },
            }}
            variant="permanent"
            anchor="left"
        >

            <Toolbar />
            <Divider />
            <IconButton onClick={handleDrawerToggle}>
                {open ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
            <List>
                {personal.map((personalName, index) => (
                    <ListItem key={personalName} disablePadding onClick={() => {
                        setSelectedChat(personalName)
                        selectedChatType != "to" && setSelectedChatType("to")
                        setIncludeFrom(true)
                    }}>
                        <ListItemButton sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}>
                            <ListItemIcon sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                                {index % 2 === 0 ? <Delete /> : <Edit />}
                            </ListItemIcon>
                            <ListItemText primary={personalName} sx={{ opacity: open ? 0 : 1 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {groups.map((group, index) => (
                    <ListItem key={group._id} disablePadding onClick={() => {
                        setSelectedChat(group.chatName)
                        selectedChatType != "group" && setSelectedChatType("group")
                        setIncludeFrom(false)
                    }}>
                        <ListItemButton sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}>
                            <ListItemIcon sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                                <Avatar sx={{ width: 24, height: 24 }}>
                                    {group.chatName}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={group.chatName} sx={{ opacity: open ? 0 : 1 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default' }}
            height={'100%'}
        >
            <Box component="main" sx={{ flexGrow: 1, overflow: "auto", height: 'calc(80vh - 40px)' }}>
                {/* <Message mes={newestMessage}></Message> */}
                {(messages).map((message) => (
                    <Message mes={message} key={message._id} />
                ))}
            </Box>
            <Box sx={{ p: 2, backgroundColor: "background.default", height: '40px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Type a message"
                            variant="outlined"
                            value={wsMessage}
                            onChange={(e) => setWSMessage(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            endIcon={<Send />}
                            onClick={() => {
                                employeesService.sendWSMessage(wsMessage, selectedChatType == "to" ? selectedChat : '', selectedChatType == "group" ? selectedChat : '')
                                setWSMessage("")
                            }}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    </Box>



}

export default Employees;