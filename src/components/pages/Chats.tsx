import { Avatar, Badge, Box, Button, Dialog, Divider, Drawer, FormControl, Grid, Icon, IconButton, InputBase, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, SelectChangeEvent, Slide, TextField, Toolbar } from "@mui/material"
import { useState, useEffect } from "react";
import { chatRoomService } from "../../config/service-config";
import { Send, ChevronRight, ChevronLeft, GroupAdd, Clear, Check, Close, Settings, Search } from "@mui/icons-material";
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
import { AccountSettingsForm } from "../forms/AccountSettingsForm";
import ChatAvatar from "../common/ChatAvatar";

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

    const [wsMessage, setWSMessage] = useState<String>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [selectedChatMembers, setSelectedChatMembers] = useState<string[]>([])
    const [selectedChatAdmins, setSelectedChatAdmins] = useState<string[]>([])
    const [selectedChatRequests, setSelectedChatRequests] = useState<string[]>([])
    const [selectedChat, setSelectedChat] = useState<string | undefined>()
    const [selectedChatType, setSelectedChatType] = useState<string | undefined>()
    const [selectedChatImage, setSelectedChatImage] = useState<string>('')
    const [filterFrom, setFilterFrom] = useState<string>('')
    const [includeFrom, setIncludeFrom] = useState<boolean>(false)
    const [filterDateTimeFrom, setFilterDateTimeFrom] = useState<Dayjs | null>()
    const [filterDateTimeTo, setFilterDateTimeTo] = useState<Dayjs | null>()
    const [refreshMessages, setRefreshMessages] = useState<boolean>(false)
    const [refreshGroups, setRefreshGroups] = useState<boolean>(false)
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const [accountSettingsDialogOpen, setAccountSettingsDialogOpen] = useState<boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [groupSearch, setGroupSearch] = useState<string>('')
    const [groupSearchResult, setGroupSearchResult] = useState<any[]>([])
    const [searchGroupsAnchor, setSearchGroupsAnchor] = useState<null | HTMLElement>(null);
    const messageContextOpen = Boolean(searchGroupsAnchor);
    const [currentUserImage, setCurrentUserImage] = useState<string>('')
    const open = Boolean(anchorEl);

    const handleSearchGroupsOpen = (event: React.MouseEvent<HTMLLIElement>) => {
        setSearchGroupsAnchor(event.currentTarget);
    };

    const handleSearchGroupsClose = () => {
        setSearchGroupsAnchor(null);
    };

    useEffect(() => {
        chatRoomService.getAllChats().then(group => {
            setGroups(group.groups)
            setAccounts(group.personal)
            const account = group.personal.find((account: any) => account._id == userData?.email)
            if (account) {
                setCurrentUserImage(account.image);
            }
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

    useEffect(() => {
        const searchFn = setTimeout(async () => {
            let searchRes = [];
            if (groupSearch) {
                searchRes = await chatRoomService.getGroups(groupSearch)
            }
            setGroupSearchResult(searchRes);
        }, 500)
        return () => clearTimeout(searchFn)
    }, [groupSearch])

    const handleFilterFromChange = (event: SelectChangeEvent) => {
        setFilterFrom(event.target.value as string);
    }

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
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
        setCreateDialogOpen(!createDialogOpen)
    }

    const handleToggleUpdateGroupDialog = () => {
        setUpdateDialogOpen(!updateDialogOpen)
    }

    const handleToggleAccountSettingsDialog = () => {
        setAccountSettingsDialogOpen(!accountSettingsDialogOpen)
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
                {accounts.map((account, index) => (
                    <ChatAvatar
                        name={account._id}
                        image={account.image}
                        drawerOpen={drawerOpen}
                        buttonType={"Account"}
                        badgeColor={activeUsers.includes(account._id) ? 'green' : 'gray'}
                        buttonClickFn={() => {
                            setSelectedChat(account._id);
                            selectedChatType != "to" && setSelectedChatType("to");
                            setIncludeFrom(true);
                            setSelectedIndex(index);
                            setSelectedChatMembers([account._id, userData?.email]);
                        }}
                        buttonColor={index != selectedIndex ? 'white' : 'gray'}
                    />
                    // <ListItem key={account._id} disablePadding onClick={() => {
                    //     setSelectedChat(account._id)
                    //     selectedChatType != "to" && setSelectedChatType("to")
                    //     setIncludeFrom(true)
                    //     setSelectedIndex(index)
                    //     setSelectedChatMembers([account._id, userData?.email])
                    // }} >
                    //     <ListItemButton sx={{
                    //         minHeight: 48,
                    //         justifyContent: 'center',
                    //         px: 2.5,
                    //         backgroundColor: index != selectedIndex ? 'white' : 'gray'
                    //     }}>
                    //         {/* <Badge badgeContent={0} color="info"> */}
                    //         <ListItemIcon sx={{
                    //             minWidth: 0,
                    //             justifyContent: 'center'
                    //         }}>
                    //             <Badge
                    //                 overlap="circular"
                    //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    //                 badgeContent={
                    //                     <Avatar sx={{ width: 12, height: 12, backgroundColor: activeUsers.includes(account._id) ? 'green' : 'gray' }}>{""}</Avatar>
                    //                 }
                    //             >
                    //                 <Avatar src={account.image} sx={{ width: 36, height: 36 }}>
                    //                     {account._id}
                    //                 </Avatar>
                    //             </Badge>
                    //         </ListItemIcon>
                    //         {/* </Badge> */}
                    //         <ListItemText primary={account._id} sx={{ opacity: drawerOpen ? 0 : 1 }} />
                    //     </ListItemButton>
                    // </ListItem>
                ))}
            </List>
            <Divider />
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search groups"
                    inputProps={{ 'aria-label': 'Search groups' }}
                    onChange={(e) => setGroupSearch(e.target.value)}
                />
            </Paper>
            <List>
                {groupSearchResult.map((group, index) => (
                    <>
                        <ChatAvatar
                            name={group.chatName}
                            image={group.image}
                            drawerOpen={drawerOpen}
                            contextClickFn={(e: any) => {
                                e.preventDefault();
                                handleSearchGroupsOpen(e);
                            }}
                            buttonType={"SearchGroup"}
                            buttonColor={'lightblue'}
                        />
                        {/* <ListItem key={group._id} disablePadding
                            onContextMenu={(e) => {
                                e.preventDefault();
                                handleSearchGroupsOpen(e);
                            }}
                        >
                            <ListItemButton color="neutral" sx={{
                                minHeight: 48,
                                justifyContent: 'center',
                                px: 2.5,
                                backgroundColor: 'lightblue'
                            }}>
                                <ListItemIcon sx={{
                                    minWidth: 0,
                                    justifyContent: 'center',
                                }}>
                                    <Avatar sx={{ width: 36, height: 36 }} src={group.image}>
                                        {group.chatName}
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary={group.chatName} sx={{ opacity: drawerOpen ? 0 : 1 }} />
                            </ListItemButton>
                        </ListItem> */}
                        <Menu
                            id="basic-menu"
                            anchorEl={searchGroupsAnchor}
                            open={messageContextOpen}
                            onClose={handleSearchGroupsClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem disabled={Boolean(group.isOpened) || group.adminsIds.includes(userData?.email) || group.membersIds.includes(userData?.email) || group.waitingIds.includes(userData?.email)}
                                onClick={() => {
                                    chatRoomService.joinToChat(group.chatName)
                                        .then((res) => {
                                            if (res.message.startsWith("Request")) {
                                                group.waitingIds.push(userData?.email)
                                            } else {
                                                group.membersIds.push(userData?.email)
                                            }
                                            dispatch('', res.message)
                                        })
                                        .catch((error) => {
                                            dispatch(`Error deleeting message: ${error.message}`, '')
                                        })
                                }}
                            >Join the chat</MenuItem>
                        </Menu>
                    </>
                ))}
            </List>
            <Divider />
            <List>
                {groups.map((group, index) => (
                    <ChatAvatar
                        name={group.chatName}
                        image={group.image}
                        drawerOpen={drawerOpen}
                        buttonType={"Group"}
                        buttonColor={index + accounts.length != selectedIndex ? 'white' : 'gray'}
                        buttonClickFn={() => {
                            setSelectedChat(group.chatName)
                            selectedChatType != "group" && setSelectedChatType("group")
                            setIncludeFrom(false)
                            setSelectedIndex(index + accounts.length)
                            setSelectedChatMembers(group.membersIds)
                            setSelectedChatAdmins(group.adminsIds)
                            setSelectedChatRequests(group.waitingIds)
                            setSelectedChatImage(group.image)
                        }}
                    />
                    // <ListItem key={group._id} disablePadding
                    //     onClick={() => {
                    //         setSelectedChat(group.chatName)
                    //         selectedChatType != "group" && setSelectedChatType("group")
                    //         setIncludeFrom(false)
                    //         setSelectedIndex(index + accounts.length)
                    //         setSelectedChatMembers(group.membersIds)
                    //         setSelectedChatAdmins(group.adminsIds)
                    //         setSelectedChatRequests(group.waitingIds)
                    //         setSelectedChatImage(group.image)
                    //     }}
                    // >
                    //     <ListItemButton color="neutral" sx={{
                    //         minHeight: 48,
                    //         justifyContent: 'center',
                    //         px: 2.5,
                    //         backgroundColor: index + accounts.length != selectedIndex ? 'white' : 'gray'
                    //     }}>
                    //         <ListItemIcon sx={{
                    //             minWidth: 0,
                    //             justifyContent: 'center',
                    //         }}>
                    //             <Avatar sx={{ width: 36, height: 36 }} src={group.image}>
                    //                 {group.chatName}
                    //             </Avatar>
                    //         </ListItemIcon>
                    //         <ListItemText primary={group.chatName} sx={{ opacity: drawerOpen ? 0 : 1 }} />
                    //     </ListItemButton>
                    // </ListItem>
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
                        {<IconButton aria-label="settings" size="large" onClick={handleClick}>
                            <Badge badgeContent={selectedChatType == 'group' ? selectedChatRequests.length : 0} color="info">
                                <Settings />
                            </Badge>
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
                                <MenuItem onClick={handleToggleAccountSettingsDialog}>Account settings</MenuItem>
                                {selectedChatType == 'group' && <MenuItem onClick={() => {
                                    chatRoomService.deleteUserFromChat(selectedChat!, userData!.email)
                                        .then(() => {
                                            dispatch('', `You have left the chat <${selectedChat}>`)
                                            setSelectedChat(undefined);
                                            setSelectedChatType(undefined);
                                            handleToggleRefreshGroups();
                                        })
                                        .catch((error) => console.log(error))
                                }}>Left the chat</MenuItem>}
                                {selectedChatType == 'group' && <MenuItem onClick={handleToggleUpdateGroupDialog}>Chat settings</MenuItem>}
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
            </Box>
            <Box component="main" sx={{ p: 1, flexGrow: 1, overflow: "auto", height: 'calc(80vh - 80px)' }}>
                {(messages).map((message) => (
                    <Message mes={message} key={message._id} deleteFn={(mes) => chatRoomService.deleteMessage(mes)} handleToggleRefreshMessages={handleToggleRefreshMessages} />
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
                accounts={accounts}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.createGroup(chatGroup);
                }}
                initAvatar={""}
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
                accounts={accounts}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.updateGroup(chatGroup);
                }}
                initAdmins={selectedChatAdmins}
                initMembers={selectedChatMembers}
                initWaitings={selectedChatRequests}
                initAvatar={selectedChatImage}
            />}
        </Dialog>
        <Dialog
            fullScreen
            open={accountSettingsDialogOpen}
            onClose={handleToggleAccountSettingsDialog}
            TransitionComponent={Transition}
        >
            <AccountSettingsForm
                submitFn={function (image: any): Promise<any> {
                    return chatRoomService.updateAccount(image);
                }}
                handleToggleDialog={handleToggleAccountSettingsDialog}
                initAvatar={currentUserImage}
            />
        </Dialog>
    </Box>
}

export default Employees;