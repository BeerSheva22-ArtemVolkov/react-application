import { Typography } from "@mui/material"

// component говорит чем является Typography
// fontSize: {xs: '3em', sm: '2em'} - соответствующие размеры для разных brakepoint-ов (разного разрешения)
// sx - как style
const Orders: React.FC = () =>
    <Typography
        sx={{ textAlign: "center", fontSize: { xs: '3em', sm: '2em', lg: '5em' } }}
        component={'div'}
    >Orders component</Typography>

export default Orders;