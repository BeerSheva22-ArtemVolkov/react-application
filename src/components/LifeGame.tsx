import { useEffect, useRef, useState } from "react"
import LifeMatrix from "../service/LifeMatrix"
import Matrix from "./Matrix"
import { getRandomMatrix } from "../util/random";
import lifeConfig from "../config/live-game-config.json"
// const { demension, tick, example4 } = lifeConfig;

const LifeGame: React.FC = () => {

    const lifeMatrix = useRef<LifeMatrix>();
    const [numbers, setNumbers] = useState<number[][]>([])

    function tickFn(): void {
        if (!lifeMatrix.current) {
            // lifeMatrix.current = new LifeMatrix(getRandomMatrix(demension, demension, 0, 2))
            lifeMatrix.current = new LifeMatrix(lifeConfig.example4)
            setNumbers(lifeMatrix.current.numbers)
        } else {
            setNumbers(lifeMatrix.current.next())
        }
    }

    useEffect(() => {
        const intervalID = setInterval(tickFn, lifeConfig.tick)
        return () => clearInterval(intervalID)
    }, [])

    return <Matrix matrix={numbers}></Matrix>
}

export default LifeGame