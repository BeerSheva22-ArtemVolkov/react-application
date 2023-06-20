import { ReactNode } from "react"
import Row from "./Row"

const Matrix: React.FC<{ matrix: number[][] }> = ({ matrix }) => {

    function getRows(): ReactNode {
        return matrix.map((row, index) => <Row row={row} key={index} />)
    }

    return <section style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px" }}>
        {getRows()}
    </section>
}

export default Matrix