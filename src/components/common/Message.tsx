import { Avatar, Box, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatchCode } from "../../hooks/hooks";

type Props = {
    mes: any;
    deleteFn: (mes: string) => Promise<any>
    handleToggleRefreshMessages: () => void
}

const AUTH_ITEM = "auth-item"
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const Message: React.FC<Props> = ({ mes, deleteFn, handleToggleRefreshMessages }) => {

    const [messageAnchor, setMessageAnchor] = useState<null | HTMLElement>(null);
    const messageContextOpen = Boolean(messageAnchor);
    const message = mes.messageObj || JSON.parse('{}');
    const isMyMessage: Boolean = mes.from == currentUser.email
    const dispatch = useDispatchCode();

    const handleMessageContextOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setMessageAnchor(event.currentTarget);
    };

    const handleMessageContextClose = () => {
        setMessageAnchor(null);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
                mb: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMyMessage ? "row-reverse" : "row",
                    alignItems: "center",
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    handleMessageContextOpen(e);
                }}
            >
                <Menu
                    id="basic-menu"
                    anchorEl={messageAnchor}
                    open={messageContextOpen}
                    onClose={handleMessageContextClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={async () => {
                        deleteFn(mes._id)
                            .then(() => {
                                dispatch('', `Message <${mes._id}> deleted`)
                                handleToggleRefreshMessages()
                            })
                            .catch((error) => {
                                
                                dispatch(`Error deleeting message: ${error.message}`, '')
                            })
                    }}>Delete message</MenuItem>
                </Menu>
                <Avatar sx={{ bgcolor: isMyMessage ? "secondary.main" : "primary.main" }}>
                    {mes.from}
                </Avatar>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        ml: isMyMessage ? 1 : 0,
                        mr: isMyMessage ? 0 : 1,
                        backgroundColor: messageContextOpen ? 'gray' : isMyMessage ? "secondary.light" : "primary.light",
                        borderRadius: isMyMessage ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                    }}
                >
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography variant="overline">{new Date(mes.sendingDateTime).getHours()}:{new Date(mes.sendingDateTime).getMinutes()}</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default Message