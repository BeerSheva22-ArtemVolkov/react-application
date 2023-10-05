import { Avatar, Badge, Box, Button, Chip, Dialog, Divider, Drawer, FormControl, Grid, Icon, IconButton, InputBase, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Select, SelectChangeEvent, Slide, TextField, Toolbar } from "@mui/material"
import { useState, useEffect } from "react";
import { chatRoomService } from "../../config/service-config";
import { Send, ChevronRight, ChevronLeft, GroupAdd, Clear, Check, Settings } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { useDispatchCode, useSelectorActiveUsers, useSelectorNewMessage } from "../../hooks/hooks";
import Message from "../common/Message";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { ChatGroupForm } from "../forms/ChatGroupForm";
import ChatGroupType from "../../model/ChatGroupType";
import { AccountSettingsForm } from "../forms/AccountSettingsForm";
import ChatAvatar from "../common/ChatAvatar";
import MessageType from "../../model/MessageType";
import ChatType from "../../model/ChatType";
import ChatFilterType from "../../model/ChatFilterType";

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
    const newestMessage = useSelectorNewMessage();
    const activeUsers = useSelectorActiveUsers();

    const [newMessage, setNewMessage] = useState<String>('');
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType>({ name: undefined, index: 0, members: [], admins: [], requests: [], class: undefined, image: '' })
    const [filter, setFilter] = useState<ChatFilterType>({ from: '', includeFrom: false, dateTimeFrom: null, dateTimeTo: null })
    const [refreshMessages, setRefreshMessages] = useState<boolean>(false)
    const [refreshGroups, setRefreshGroups] = useState<boolean>(false)
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const [accountSettingsDialogOpen, setAccountSettingsDialogOpen] = useState<boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
    const [groupSearch, setGroupSearch] = useState<string>('')
    const [groupSearchResult, setGroupSearchResult] = useState<any[]>([])
    const [searchGroupsAnchor, setSearchGroupsAnchor] = useState<null | HTMLElement>(null);
    const [currentUserImage, setCurrentUserImage] = useState<string>('')

    const open = Boolean(settingsAnchor);
    const messageContextOpen = Boolean(searchGroupsAnchor);

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
        if (!selectedChat.name) {
            setMessages([]);
        }
        if (selectedChat.name && selectedChat.class) {
            chatRoomService.getFromChat(selectedChat.name, filter.includeFrom, selectedChat.class, filter.from, filter.dateTimeFrom?.toISOString() || '', filter.dateTimeTo?.toISOString() || '')
                .then(messages => setMessages(messages));
        }
    }, [selectedChat.name, refreshMessages])

    useEffect(() => {
        if (newestMessage) {
            setMessages([...messages, newestMessage])
        }
    }, [newestMessage])

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
        setFilter({ ...filter, from: event.target.value })
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
        setFilter({ ...filter, from: '', dateTimeFrom: null, dateTimeTo: null })
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

    const handleSettingsOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSettingsAnchor(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setSettingsAnchor(null);
    };

    let lastDate: Date = new Date(-8640000000000000)

    function dtDivider(date: Date) {
        if (new Date(date) > new Date(lastDate)) {
            lastDate = date
            return <Divider>
                <Chip label={date.toLocaleDateString()} />
            </Divider>
        } else {
            return <></>
        }
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
                {drawerOpen ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
            <List>
                {accounts.map((account, index) => (
                    <ChatAvatar
                        key={account._id + "_" + account.index}
                        name={account._id}
                        image={account.image}
                        drawerOpen={drawerOpen}
                        buttonType={"Account"}
                        badgeColor={activeUsers.includes(account._id) ? 'green' : 'gray'}
                        buttonClickFn={() => {
                            setSelectedChat({ ...selectedChat, name: account._id, class: "to", index, members: [account._id, userData?.email] })
                            setFilter({ ...filter, includeFrom: true })
                        }}
                        buttonColor={index != selectedChat.index ? 'white' : 'gray'}
                    />
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
                {groupSearchResult.map(group => (
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
                                            dispatch(`Error request to join the group: ${error.message}`, '')
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
                        buttonColor={index + accounts.length != selectedChat.index ? 'white' : 'gray'}
                        buttonClickFn={() => {
                            setSelectedChat({ ...selectedChat, name: group.chatName, class: "group", index: index + accounts.length, members: group.membersIds, admins: group.adminsIds, requests: group.waitingIds, image: group.image })
                            setFilter({ ...filter, includeFrom: false })
                        }}
                    />
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
                                value={filter.from}
                                label="Age"
                                onChange={handleFilterFromChange}
                            >
                                {selectedChat.members.map(member => <MenuItem value={member}>{member}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filter.dateTimeFrom}
                                onChange={newValue => setFilter({ ...filter, dateTimeFrom: newValue })}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date time from"
                                value={filter.dateTimeTo}
                                onChange={newValue => setFilter({ ...filter, dateTimeFrom: newValue })}
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
                        <IconButton aria-label="settings" size="large" onClick={handleSettingsOpen}>
                            <Badge badgeContent={selectedChat.class == 'group' ? selectedChat.requests.length : 0} color="info">
                                <Settings />
                            </Badge>
                        </IconButton>
                        <div>
                            <Menu
                                id="basic-menu"
                                anchorEl={settingsAnchor}
                                open={open}
                                onClose={handleSettingsClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleToggleAccountSettingsDialog}>Account settings</MenuItem>
                                {selectedChat.class == 'group' && <MenuItem onClick={() => {
                                    chatRoomService.deleteUserFromChat(selectedChat.name!, userData!.email)
                                        .then(() => {
                                            dispatch('', `You have left the chat <${selectedChat}>`)
                                            setSelectedChat({ ...selectedChat, name: undefined, class: undefined })
                                            handleToggleRefreshGroups();
                                        })
                                        .catch((error) => console.log(error))
                                }}>Left the chat</MenuItem>}
                                {selectedChat.class == 'group' && <MenuItem onClick={handleToggleUpdateGroupDialog}>Chat settings</MenuItem>}
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
            </Box>
            <Box component="main" sx={{ p: 1, flexGrow: 1, overflow: "auto", height: 'calc(80vh - 80px)' }}>
                {messages.length > 0
                    ?
                    messages.map(message => (
                        <>
                            {dtDivider(new Date(message.sendingDateTime.slice(0, 10)))}
                            <Message
                                mes={message}
                                key={message._id}
                                deleteFn={(mes) => chatRoomService.deleteMessage(mes)}
                                handleToggleRefreshMessages={handleToggleRefreshMessages}
                            />
                        </>
                    ))
                    :
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', fontSize: 'xxx-large' }}>No messages yet</div>
                }
            </Box>
            <Box sx={{ p: 2, backgroundColor: "background.default", height: '40px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Type a message"
                            variant="outlined"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            endIcon={<Send />}
                            onClick={() => {
                                chatRoomService.sendWSMessage(newMessage, selectedChat.class == "to" ? selectedChat.name! : '', selectedChat.class == "group" ? selectedChat.name! : '')
                                setNewMessage("")
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
            <ChatGroupForm
                headerText="Create chat group"
                handleToggleDialog={handleToggleCreateGroupDialog}
                handleToggleRefreshGroups={handleToggleRefreshGroups}
                accounts={accounts}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.createGroup(chatGroup);
                }}
                initAvatar={""}
            />
        </Dialog>
        <Dialog
            fullScreen
            open={updateDialogOpen}
            onClose={handleToggleUpdateGroupDialog}
            TransitionComponent={Transition}
        >
            <ChatGroupForm
                initChatName={selectedChat.name}
                headerText="Update chat group"
                handleToggleDialog={handleToggleUpdateGroupDialog}
                handleToggleRefreshGroups={handleToggleRefreshGroups}
                accounts={accounts}
                submitFn={function (chatGroup: ChatGroupType): Promise<any> {
                    return chatRoomService.updateGroup(chatGroup);
                }}
                initAdmins={selectedChat.admins}
                initMembers={selectedChat.members}
                initWaitings={selectedChat.requests}
                initAvatar={selectedChat.image}
            />
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