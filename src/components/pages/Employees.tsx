import { AppBar, Avatar, Badge, Box, Button, CssBaseline, Divider, Drawer, FormControl, Grid, Icon, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Modal, Select, SelectChangeEvent, TextField, Toolbar, Typography, setRef, styled, useMediaQuery, useTheme } from "@mui/material"
import { useState, useRef, useMemo, useEffect } from "react";
import { employeesService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit, Man, Woman, Visibility, Send, ChevronRight, ChevronLeft, GroupAdd, Clear, Check } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorActiveUsers, useSelectorEmployees } from "../../hooks/hooks";
import Message from "../common/Message";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// import { useDispatchCode } from "../../hooks/hooks";

let drawerWidth = 240

const Employees: React.FC = () => {

    const [open, setOpen] = useState<boolean>(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
        drawerWidth = open ? 240 : 60
    };

    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const newestMessage = useSelectorEmployees();
    const activeUsers = useSelectorActiveUsers();
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
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [selectedChatMembers, setSelectedChatMembers] = useState<string[]>([])

    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    const AUTH_ITEM = "auth-item"
    const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');
    // const employee = useRef<Employee | undefined>();
    const [watchMode, setWatchMode] = useState<string>('')

    useEffect(() => {
        employeesService.getGroups().then(group => {
            console.log(group);
            setGroups(group.groups)
            setPersonal(group.personal)
        });
    }, [])

    const [selectedChat, setSelectedChat] = useState<string | undefined>()
    const [selectedChatType, setSelectedChatType] = useState<string | undefined>()
    const [filterFrom, setFilterFrom] = useState<string>('')
    const [includeFrom, setIncludeFrom] = useState<boolean>(false)
    const [filterDateTimeFrom, setFilterDateTimeFrom] = useState<Dayjs | null>()
    const [filterDateTimeTo, setFilterDateTimeTo] = useState<Dayjs | null>()
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {
        if (selectedChat && selectedChatType) {
            employeesService.getFromChat(selectedChat, includeFrom, selectedChatType, filterFrom, filterDateTimeFrom?.toISOString() || '', filterDateTimeTo?.toISOString() || '').then(messages => setMessages(messages));
        }
    }, [newestMessage, selectedChat, refresh])

    const handleFilterFromChange = (event: SelectChangeEvent) => {
        setFilterFrom(event.target.value as string);
    }

    const handleToggleRefresh = () => {
        setRefresh(!refresh)
    }

    const handleClearFilters = () => {
        setFilterFrom('')
        setFilterDateTimeFrom(null)
        setFilterDateTimeTo(null)
        handleToggleRefresh()
    }

    return <Box sx={{ display: 'flex' }}>
        <Drawer
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
                        setSelectedIndex(index)
                        setSelectedChatMembers([personalName, currentUser.email])
                    }} >
                        <ListItemButton sx={{
                            minHeight: 48,
                            justifyContent: 'center',
                            px: 2.5,
                            backgroundColor: index != selectedIndex ? 'white' : 'gray'
                        }}>
                            <Badge badgeContent={0} color="info">
                                <ListItemIcon sx={{
                                    minWidth: 0,
                                    justifyContent: 'center'
                                }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <Avatar sx={{ width: 12, height: 12, backgroundColor: activeUsers.includes(personalName) ? 'green' : 'gray' }}>{""}</Avatar>
                                        }
                                    >
                                        <Avatar sx={{ width: 36, height: 36 }}>
                                            {personalName}
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                            </Badge>
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
                        setSelectedIndex(index + personal.length)
                        setSelectedChatMembers(group.membersIds.concat(group.adminIds))
                    }}>
                        <ListItemButton color="neutral" sx={{
                            minHeight: 48,
                            justifyContent: 'center',
                            px: 2.5,
                            backgroundColor: index + personal.length != selectedIndex ? 'white' : 'gray'
                        }}>
                            <ListItemIcon sx={{
                                minWidth: 0,
                                justifyContent: 'center',
                            }}>
                                <Avatar sx={{ width: 36, height: 36 }}>
                                    {group.chatName}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={group.chatName} sx={{ opacity: open ? 0 : 1 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Button sx={{
                lineHeight: 0,
                minWidth: 0,
                height: 48,
                justifyContent: 'center',
                px: 2.5,
                backgroundColor: 'white'
            }}>
                <Icon sx={{
                    justifyContent: 'center',
                }}>
                    {<GroupAdd />}
                </Icon>
                <ListItemText primary={"Create new group"} sx={{ opacity: open ? 0 : 1 }} />
            </Button>
        </Drawer>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default' }}
            height={'100%'}
        >
            <Box sx={{ p: 2, backgroundColor: "background.default", height: '40px' }}>
                <Grid container spacing={1} justifyContent='flex-start' alignItems="flex-start">
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-from-select-label">From</InputLabel>
                            <Select
                                labelId="filter-from-select-label"
                                id="demo-simple-select"
                                value={filterFrom}
                                label="Age"
                                onChange={handleFilterFromChange}
                            >
                                {selectedChatMembers.map(member => <MenuItem value={member}>{member}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filterDateTimeFrom}
                                onChange={(newValue) => setFilterDateTimeFrom(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filterDateTimeTo}
                                onChange={(newValue) => setFilterDateTimeTo(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton aria-label="delete" size="large" onClick={handleClearFilters}>
                            <Clear />
                        </IconButton>
                        <IconButton aria-label="delete" size="large" onClick={handleToggleRefresh}>
                            <Check />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Box component="main" sx={{ p: 1, flexGrow: 1, overflow: "auto", height: 'calc(80vh - 80px)' }}>
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
                                employeesService.sendWSMessage(wsMessage, selectedChatType == "to" ? selectedChat! : '', selectedChatType == "group" ? selectedChat! : '')
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