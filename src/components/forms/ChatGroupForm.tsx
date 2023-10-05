import { Close } from "@mui/icons-material"
import { AppBar, Toolbar, IconButton, Typography, Button, Grid, TextField, FormControlLabel, Switch, List, ListItem, Checkbox, ListItemButton, ListItemAvatar, Avatar, ListItemText, ImageList, ImageListItem } from "@mui/material"
import ChatGroupType from "../../model/ChatGroupType"
import { useState } from "react"
import { useDispatchCode } from "../../hooks/hooks"
import image from './1.png'

type Props = {
    submitFn: (chatGroup: ChatGroupType) => Promise<any>
    handleToggleDialog: () => void
    handleToggleRefreshGroups: () => void
    accounts: any[]
    initAdmins?: string[]
    initMembers?: string[]
    initChatName?: string
    headerText: string
    initWaitings?: string[]
    initAvatar: string
}

const AUTH_ITEM = "auth-item"
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const ChatGroupForm: React.FC<Props> = ({ initChatName = '', headerText, submitFn, handleToggleDialog, handleToggleRefreshGroups, accounts, initAdmins, initMembers, initWaitings, initAvatar }) => {

    const dispatch = useDispatchCode();
    const [createGroupIsOpen, setCreateGroupIsOpen] = useState<boolean>(false)
    const [createGroupAdmins, setCreateGroupAdmins] = useState<string[]>(initAdmins || []);
    const [createGroupMembers, setCreateGroupMembers] = useState<string[]>(initMembers || []);
    const [createGroupChatName, setCreateGroupChatName] = useState<string>(initChatName)
    const [imageToLoad, setImageToLoad] = useState<any>(null)
    const [imageToShow, setImageToShow] = useState<any>(initAvatar)

    const onImageChange = async (event: any) => {
        const imageTarget = event.target.files
        const image = imageTarget ? imageTarget[0] : ''
        console.log(imageTarget, image);

        if (imageTarget && imageTarget[0]) {
            setImageToShow(URL.createObjectURL(image));
            const res = await toBase64(image)
            setImageToLoad(res);
        } else {
            setImageToShow(null);
        }
    }

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
                    submitFn({ chatName: createGroupChatName, isOpened: createGroupIsOpen, membersIds: createGroupMembers, adminsIds: createGroupAdmins, image: imageToLoad })
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
                    <Button component="label" variant="contained">
                        <input type="file" onChange={onImageChange} className="filetype" />
                    </Button>
                    <Button component="label" variant="contained" onClick={onImageChange}>
                        Delete image
                    </Button>
                    <ImageList>
                        <ImageListItem>
                            <img src={imageToShow ? imageToShow : image} style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                        </ImageListItem>
                    </ImageList>
                </Grid>
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
                    {accounts.filter((p: any) => p._id != currentUser.email).map((account) => {
                        const labelId = `checkbox-list-secondary-label-${account._id}`;
                        return (
                            <ListItem
                                key={account._id}
                                sx={{ backgroundColor: initWaitings?.indexOf(account._id) !== -1 ? 'lightgray' : '' }}
                                secondaryAction={
                                    <>
                                        <Checkbox
                                            edge="start"
                                            onChange={handleSelectAdmin(account._id, 'admin')}
                                            checked={createGroupAdmins.indexOf(account._id) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                        <Checkbox
                                            edge="start"
                                            onChange={handleSelectAdmin(account._id, 'member')}
                                            checked={createGroupMembers.indexOf(account._id) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                    </>
                                }
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`Avatar n°${account._id + 1}`}
                                            src={`/static/images/avatar/${account._id + 1}.jpg`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primary={account._id} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
        </Grid>
    </>
}