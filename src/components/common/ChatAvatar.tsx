import { Avatar, Badge, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { group } from "console";
import ChatGroupType from "../../model/ChatGroupType";

type Props = {
    name: string
    image: string
    contextClickFn?: (e: any) => void
    buttonClickFn?: () => void
    drawerOpen: boolean
    buttonType: "Group" | "Account" | "SearchGroup"
    badgeColor?: string
    buttonColor: string
}

const ChatAvatar: React.FC<Props> = ({ name, image, buttonClickFn, contextClickFn, drawerOpen, buttonType, badgeColor, buttonColor }) => {
    return <ListItem
        key={name}
        disablePadding
        onContextMenu={contextClickFn}
        onClick={buttonClickFn}
    >
        <ListItemButton color="neutral" sx={{
            minHeight: 48,
            justifyContent: 'center',
            px: 2.5,
            backgroundColor: buttonColor
        }}>
            <ListItemIcon sx={{
                minWidth: 0,
                justifyContent: 'center',
            }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <Avatar sx={{ width: 12, height: 12, backgroundColor: badgeColor, visibility: buttonType == "Account" ? "initial" : "hidden" }}>{""}</Avatar>
                    }
                >
                    <Avatar src={image} sx={{ width: 36, height: 36 }}>
                        {name}
                    </Avatar>
                </Badge>
            </ListItemIcon>
            <ListItemText primary={name} sx={{ opacity: drawerOpen ? 0 : 1 }} />
        </ListItemButton>
    </ListItem>

}

export default ChatAvatar