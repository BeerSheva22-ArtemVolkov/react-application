import { AppBar, Avatar, Badge, Box, Button, Checkbox, CssBaseline, Dialog, Divider, Drawer, FormControl, FormControlLabel, Grid, Icon, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Select, SelectChangeEvent, Slide, Switch, TextField, Toolbar, Typography, setRef, styled, useMediaQuery, useTheme } from "@mui/material"
import { useState, useRef, useMemo, useEffect } from "react";
import { chatRoomService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit, Man, Woman, Visibility, Send, ChevronRight, ChevronLeft, GroupAdd, Clear, Check, Close, Settings } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { useDispatchCode, useSelectorActiveUsers, useSelectorEmployees } from "../../hooks/hooks";
import Message from "../common/Message";
import { Dayjs } from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ChatGroupForm } from "../forms/ChatGroupForm";
import ChatGroupType from "../../model/ChatGroupType";

let drawerWidth = 240

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Employees: React.FC = () => {

    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const newestMessage = useSelectorEmployees();
    const activeUsers = useSelectorActiveUsers();
    const theme = useTheme();
    const AUTH_ITEM = "auth-item"
    const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');
    const isPortrait = useMediaQuery(theme.breakpoints.down('md'));

    const [wsMessage, setWSMessage] = useState<String>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [personal, setPersonal] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [selectedChatMembers, setSelectedChatMembers] = useState<string[]>([])
    const [selectedChatAdmins, setSelectedChatAdmins] = useState<string[]>([])
    const [selectedChat, setSelectedChat] = useState<string | undefined>()
    const [selectedChatType, setSelectedChatType] = useState<string | undefined>()
    const [filterFrom, setFilterFrom] = useState<string>('')
    const [includeFrom, setIncludeFrom] = useState<boolean>(false)
    const [filterDateTimeFrom, setFilterDateTimeFrom] = useState<Dayjs | null>()
    const [filterDateTimeTo, setFilterDateTimeTo] = useState<Dayjs | null>()
    const [refreshMessages, setRefreshMessages] = useState<boolean>(false)
    const [refreshGroups, setRefreshGroups] = useState<boolean>(false)
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const [drawerOpen, setDrawewrOpen] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        chatRoomService.getGroups().then(group => {
            setGroups(group.groups)
            setPersonal(group.personal)
        });
    }, [refreshGroups])

    useEffect(() => {
        if (!selectedChat) {
            setMessages([]);
        }
        if (selectedChat && selectedChatType) {
            chatRoomService.getFromChat(selectedChat, includeFrom, selectedChatType, filterFrom, filterDateTimeFrom?.toISOString() || '', filterDateTimeTo?.toISOString() || '').then(messages => setMessages(messages));
        }
    }, [newestMessage, selectedChat, refreshMessages])

    const handleFilterFromChange = (event: SelectChangeEvent) => {
        setFilterFrom(event.target.value as string);
    }

    const handleDrawerToggle = () => {
        setDrawewrOpen(!drawerOpen);
        drawerWidth = drawerOpen ? 240 : 60
    };

    const handleToggleRefreshMessages = () => {
        setRefreshMessages(!refreshMessages)
    }

    const handleToggleRefreshGroups = () => {
        setRefreshGroups(!refreshGroups)
    }

    const handleClearFilters = () => {
        setFilterFrom('')
        setFilterDateTimeFrom(null)
        setFilterDateTimeTo(null)
        handleToggleRefreshMessages()
    }

    const handleToggleCreateGroupDialog = () => {
        console.log('toggle create');
        setCreateDialogOpen(!createDialogOpen)
    }

    const handleToggleUpdateGroupDialog = () => {
        console.log('toggle update');
        setUpdateDialogOpen(!updateDialogOpen)
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                {drawerOpen ? <ChevronRight /> : <ChevronLeft />}
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
                            <ListItemText primary={personalName} sx={{ opacity: drawerOpen ? 0 : 1 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {groups.map((group, index) => (
                    <ListItem key={group._id} disablePadding
                        onClick={() => {
                            setSelectedChat(group.chatName)
                            selectedChatType != "group" && setSelectedChatType("group")
                            setIncludeFrom(false)
                            setSelectedIndex(index + personal.length)
                            setSelectedChatMembers(group.membersIds)
                            setSelectedChatAdmins(group.adminsIds)
                        }}
                    >
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
                            <ListItemText primary={group.chatName} sx={{ opacity: drawerOpen ? 0 : 1 }} />
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
            }}
                onClick={handleToggleCreateGroupDialog}>
                <Icon sx={{
                    justifyContent: 'center',
                }}>
                    {<GroupAdd />}
                </Icon>
                <ListItemText primary={"Create new group"} sx={{ opacity: drawerOpen ? 0 : 1 }} />
            </Button>
        </Drawer>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default' }}
            height={'100%'}
        >
            <Box sx={{ p: 2, backgroundColor: "background.default", height: '40px' }}>
                <Grid container spacing={1} justifyContent='flex-start' alignItems="flex-start">
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filterDateTimeFrom}
                                onChange={(newValue) => setFilterDateTimeFrom(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filterDateTimeTo}
                                onChange={(newValue) => setFilterDateTimeTo(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        <IconButton aria-label="clear" size="large" onClick={handleClearFilters}>
                            <Clear />
                        </IconButton>
                        <IconButton aria-label="confirm" size="large" onClick={handleToggleRefreshMessages}>
                            <Check />
                        </IconButton>
                        {selectedChatType == 'group' && <IconButton aria-label="settings" size="large" onClick={handleClick}>
                            <Settings />
                        </IconButton>}
                        <div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => {
                                    chatRoomService.deleteUserFromChat(selectedChat!, currentUser.email)
                                        .then(() => {
                                            dispatch('', `You have left the chat <${selectedChat}>`)
                                            setSelectedChat(undefined);
                                            setSelectedChatType(undefined);
                                            handleToggleRefreshGroups();
                                        })
                                        .catch((error) => console.log(error))
                                }}>Left the chat</MenuItem>
                                <MenuItem onClick={handleToggleUpdateGroupDialog}>Chat settings</MenuItem>
                            </Menu>
                        </div>

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
                                chatRoomService.sendWSMessage(wsMessage, selectedChatType == "to" ? selectedChat! : '', selectedChatType == "group" ? selectedChat! : '')
                                setWSMessage("")
                            }}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box >
        <Dialog
            fullScreen
            open={createDialogOpen}
            onClose={handleToggleCreateGroupDialog}
            TransitionComponent={Transition}
        >
            {<ChatGroupForm
                headerText="Create chat group"
                handleToggleDialog={handleToggleCreateGroupDialog}
                handleToggleRefreshGroups={handleToggleRefreshGroups}
                personal={personal}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.createGroup(chatGroup)
                }}
            />}
        </Dialog>
        <Dialog
            fullScreen
            open={updateDialogOpen}
            onClose={handleToggleUpdateGroupDialog}
            TransitionComponent={Transition}
        >
            {<ChatGroupForm
                initChatName={selectedChat}
                headerText="Update chat group"
                handleToggleDialog={handleToggleUpdateGroupDialog}
                handleToggleRefreshGroups={handleToggleRefreshGroups}
                personal={personal}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.updateGroup(chatGroup)
                }}
                initAdmins={selectedChatAdmins}
                initMembers={selectedChatMembers}
            />}
        </Dialog>
    </Box>
}

export default Employees;