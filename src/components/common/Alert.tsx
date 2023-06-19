import { CSSProperties } from "react"
import { StatusType } from "../../model/StatusType"

interface Props {
    status: StatusType
    message?: string
}

const statusProps: Map<StatusType, CSSProperties> = new Map([
    ["error", { backgroundColor: "lightpink" }],
    ["success", { backgroundColor: "lightgreen" }],
    ["warning", { backgroundColor: "orange", color: "white" }]
])

const Alert: React.FC<Props> = ({ status, message }) => {
    return (<div>
        <p style={statusProps.get(status)}>{message}</p>
    </div>)
}

export default Alert