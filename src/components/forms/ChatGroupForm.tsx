import { Close } from "@mui/icons-material"
import { AppBar, Toolbar, IconButton, Typography, Button, Grid, TextField, FormControlLabel, Switch, List, ListItem, Checkbox, ListItemButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material"
import { chatRoomService } from "../../config/service-config"
import ChatGroupType from "../../model/ChatGroupType"
import { useState } from "react"
import { useDispatchCode } from "../../hooks/hooks"

type Props = {
    submitFn: (chatGroup: ChatGroupType) => Promise<any>
    handleToggleDialog: () => void
    handleToggleRefreshGroups: () => void
    personal: string[]
    initAdmins?: string[]
    initMembers?: string[]
    initChatName?: string
    headerText: string

}

const AUTH_ITEM = "auth-item"
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');



export const ChatGroupForm: React.FC<Props> = ({ initChatName = '', headerText, submitFn, handleToggleDialog, handleToggleRefreshGroups, personal, initAdmins, initMembers }) => {

    const dispatch = useDispatchCode();
    const [createGroupIsOpen, setCreateGroupIsOpen] = useState<boolean>(false)
    const [createGroupAdmins, setCreateGroupAdmins] = useState<string[]>(initAdmins || []);
    const [createGroupMembers, setCreateGroupMembers] = useState<string[]>(initMembers || []);
    const [createGroupChatName, setCreateGroupChatName] = useState<string>(initChatName)

    const handleCreateGroupIsOpen = () => {
        setCreateGroupIsOpen(!createGroupIsOpen)
    }

    const handleSelectAdmin = (value: string, type: string) => () => {

        const indexAdmin = createGroupAdmins.indexOf(value);
        const indexMember = createGroupMembers.indexOf(value);
        const adminsChecked = [...createGroupAdmins];
        const membersChecked = [...createGroupMembers];

        switch (type) {
            case "admin":
                if (indexAdmin === -1) {
                    adminsChecked.push(value);
                } else {
                    adminsChecked.splice(indexAdmin, 1);
                }
                break;
            case "member":
                if (indexMember === -1) {
                    membersChecked.push(value);
                } else {
                    membersChecked.splice(indexMember, 1);
                }
                break;
        }

        if (type == 'admin' && indexMember !== -1) {
            membersChecked.splice(indexMember, 1);
        } else if (type == 'member' && indexAdmin !== -1) {
            adminsChecked.splice(indexAdmin, 1);
        }
        setCreateGroupMembers(membersChecked);
        setCreateGroupAdmins(adminsChecked);

    };

    const handleChatName = (event: any) => {
        setCreateGroupChatName(event.target.value as string);
    }

    return <>
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleToggleDialog}
                    aria-label="close"
                >
                    <Close />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {headerText}
                </Typography>
                <Button autoFocus color="inherit" onClick={() => {
                    submitFn({ chatName: createGroupChatName, isOpened: createGroupIsOpen, membersIds: createGroupMembers, adminsIds: createGroupAdmins })
                        .then(() => {
                            dispatch('', `Group ${createGroupChatName} was ${initChatName ? 'updated' : 'created'}`)
                            handleToggleDialog();
                            handleToggleRefreshGroups();
                            setCreateGroupChatName('');
                            setCreateGroupAdmins([]);
                            setCreateGroupMembers([]);
                            setCreateGroupIsOpen(false);
                        })
                        .catch((err) => dispatch(err.message, ''))
                }}>
                    save
                </Button>
            </Toolbar>
        </AppBar>
        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start" p={1}>
            <Grid container xs={4} item direction='column' justifyContent="flex-start" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <TextField disabled={Boolean(initChatName)} id="standard-basic" label="Chat group name" variant="standard" value={createGroupChatName} onChange={handleChatName} />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel control={<Switch
                        checked={createGroupIsOpen}
                        onChange={handleCreateGroupIsOpen}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label='Is open group' />
                </Grid>
            </Grid>
            <Grid container item xs={8}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {personal.filter(p => p != currentUser).map((personalName) => {
                        const labelId = `checkbox-list-secondary-label-${personalName}`;
                        return (
                            <ListItem
                                key={personalName}
                                secondaryAction={
                                    <>
                                        <Checkbox
                                            edge="start"
                                            onChange={handleSelectAdmin(personalName, 'admin')}
                                            checked={createGroupAdmins.indexOf(personalName) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                        <Checkbox
                                            edge="start"
                                            onChange={handleSelectAdmin(personalName, 'member')}
                                            checked={createGroupMembers.indexOf(personalName) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                    </>
                                }
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`Avatar n°${personalName + 1}`}
                                            src={`/static/images/avatar/${personalName + 1}.jpg`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primary={personalName} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
        </Grid>
    </>
}