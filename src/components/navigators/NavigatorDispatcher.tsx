
import { useTheme } from "@mui/material/styles";
import Navigator, { RouteType } from "./Navigator";
import { useMediaQuery } from "@mui/material";
import NavigatorPortrait from "./NavigatorPortrait";

const NavigatorDispathcer: React.FC<{routes: RouteType[]}> = ({routes}) => {
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'));
    return !isPortrait ? <Navigator routes={routes}/> : <NavigatorPortrait routes={routes}/>
}

export default NavigatorDispathcer