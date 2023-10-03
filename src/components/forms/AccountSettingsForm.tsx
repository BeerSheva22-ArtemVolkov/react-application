import { Close } from "@mui/icons-material"
import { AppBar, Toolbar, IconButton, Typography, Button, Grid, TextField, FormControlLabel, Switch, List, ListItem, Checkbox, ListItemButton, ListItemAvatar, Avatar, ListItemText, ImageList, ImageListItem } from "@mui/material"
import ChatGroupType from "../../model/ChatGroupType"
import { useState } from "react"
import { useDispatchCode } from "../../hooks/hooks"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type Props = {
    submitFn: (accountImage: any) => Promise<any>
    handleToggleDialog: () => void
}

const AUTH_ITEM = "auth-item"
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const AccountSettingsForm: React.FC<Props> = ({ submitFn, handleToggleDialog }) => {

    const dispatch = useDispatchCode();
    const [imageToLoad, setImageToLoad] = useState<any>(null)
    const [imageToShow, setImageToShow] = useState<any>(null)

    const onImageChange = async (event: any) => {

        const imageTarget = event.target.files
        if (imageTarget && imageTarget[0]) {
            setImageToShow(URL.createObjectURL(imageTarget[0]));
            const res = await toBase64(imageTarget[0])
            setImageToLoad(res);
        }
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
                    Account settings
                </Typography>
                <Button autoFocus color="inherit" onClick={() => {
                    submitFn(imageToLoad)
                        .then(() => {
                            console.log('success account update');
                        })
                        .catch((err) => dispatch(err.message, ''))
                }}>
                    save
                </Button>
            </Toolbar>
        </AppBar>
        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start" p={1}>
            <Grid item>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    <input type="file" onChange={onImageChange} className="filetype" />
                </Button>
                <ImageList>
                    <ImageListItem>
                        <img alt="preview image" src={imageToShow} />
                    </ImageListItem>
                </ImageList>
            </Grid>
        </Grid>
    </>
}