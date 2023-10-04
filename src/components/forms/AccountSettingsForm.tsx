import { Close } from "@mui/icons-material"
import { AppBar, Toolbar, IconButton, Typography, Button, Grid, TextField, FormControlLabel, Switch, List, ListItem, Checkbox, ListItemButton, ListItemAvatar, Avatar, ListItemText, ImageList, ImageListItem } from "@mui/material"
import { useState } from "react"
import { useDispatchCode } from "../../hooks/hooks"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import image from './1.png'

type Props = {
    submitFn: (accountImage: any) => Promise<any>
    handleToggleDialog: () => void
    initAvatar: string
}

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const AccountSettingsForm: React.FC<Props> = ({ submitFn, handleToggleDialog, initAvatar }) => {

    const dispatch = useDispatchCode();
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
                            handleToggleDialog()
                            dispatch('', 'Avatar updated')
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
                <Button component="label" variant="contained" onClick={onImageChange}>
                    Delete image
                </Button>
                <ImageList>
                    <ImageListItem>
                        <img src={imageToShow ? imageToShow : image} style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    </ImageListItem>
                </ImageList>
            </Grid>
        </Grid>
    </>
}