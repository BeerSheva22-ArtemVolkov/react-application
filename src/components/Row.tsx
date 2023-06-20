import { ReactNode } from "react"

const Row: React.FC<{ row: number[] }> = ({ row }) => {

    function getDivs(): ReactNode {
        let size: number = 500 / row.length;
        return row.map((num, index) =>
            <div key={index} style={{ width: size, height: size, backgroundColor: num ? "black" : "white", border: 'solid 1px gray' }}>

            </div>)
    }

    return <section style={{ display: 'flex' }}>
        {getDivs()}
    </section>
}

export default Row