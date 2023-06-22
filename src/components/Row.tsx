import { ReactNode, useEffect, useState } from "react"
import { useSelectorCount, useSelectorSize } from "./redux/store"

const Row: React.FC<{ row: number[] }> = ({ row }) => {

    const size = useSelectorSize();
    const lifesCount = useSelectorCount();

    function getDivs(): ReactNode {
        return row.map((num, index) =>
            <div key={index} style={{ width: size / lifesCount, height: size / lifesCount, backgroundColor: num ? "black" : "white", border: 'solid 1px gray' }}>

            </div>)
    }

    return <section style={{ display: 'flex' }}>
        {getDivs()}
    </section>
}

export default Row