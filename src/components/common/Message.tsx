import { Avatar, Box, Paper, Typography } from "@mui/material";

type Props = {
    mes: any;
}

const AUTH_ITEM = "auth-item"
const currentUser = JSON.parse(localStorage.getItem(AUTH_ITEM) || '{}');

const Message: React.FC<Props> = ({ mes }) => {

    const message = mes.messageObj || JSON.parse('{}');
    const isMyMessage: Boolean = mes.from == currentUser.email

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
            >
                <Avatar sx={{ bgcolor: isMyMessage ? "secondary.main" : "primary.main" }}>
                    {mes.from}
                </Avatar>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        ml: isMyMessage ? 1 : 0,
                        mr: isMyMessage ? 0 : 1,
                        backgroundColor: isMyMessage ? "secondary.light" : "primary.light",
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