import { useEffect, useState } from "react";
import { useSelectorDirection } from "./redux/store"
import { useDispatch } from "react-redux";
import { countActions } from "./redux/slices/lifesCountSlice";
import LifeGame from "./LifeGame";
import Input from "./common/Input";
import InputResult from "../model/InputResult";
import { InputType } from "zlib";

const Lifes: React.FC = () => {

    const dispatch = useDispatch();
    const [lifesCount, setLifesCount] = useState<number>()

    const flexDirection = useSelectorDirection();

    useEffect(() => {
        window.addEventListener('resize', () => {
            dispatch(countActions.setCount(lifesCount))
        })
    }, [])

    function sumbitFn(input: string): InputResult {
        let lifesCount = Number(input)
        let res: InputResult = { status: "success" }
        if (lifesCount < 0 || lifesCount > 5) {
            res = { status: "error", message: "not acceptabe count of lifes" }
        } else if (lifesCount == 0) {
            res = { status: "warning", message: "almost there" }
        } else {
            setLifesCount(lifesCount)
        }
        return res;
    }

    return (<section style={{ display: "flex", flexDirection, justifyContent: "space-around", alignItems: "center", height: "100vh" }}>
        {!lifesCount && <Input submitFn={sumbitFn} placeholder={"Enter number from 1 to 5"} type="number" />}
        {lifesCount && Array.from({ length: lifesCount }).map((ar, index) => {
            return <LifeGame key={index} />
        })}

    </section>)
}

export default Lifes;