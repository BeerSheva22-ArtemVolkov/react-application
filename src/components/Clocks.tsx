import { useEffect, useState } from "react";
import { Clock } from "./Clock"
import { SelectTimeZone } from "./SelectTimeZone";
import Input from "./common/Input";
import InputResult from "../model/InputResult";
import timeZones from "../data/time-zones"
import { log, time } from "console";
import startCountries from "../data/startCountries.json"

const Clocks: React.FC = () => {

    const [time, setTime] = useState<Date>(new Date()) //задает начальное значение time

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTime(new Date())
        }, 1000);
        return () => {
            clearInterval(intervalID)
        }
    }, []) // пустой массив - нет зависимостей

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            {startCountries.map((x, index) => {
                return (<Clock time={time} cityCountry={x.city} key={index} />)
            })}
            {/* <Input submitFn={submitFn} placeholder={"select"} buttonTitle={"Sumbit"} />
            <Clock time={time} cityCountry={timeZone} />
            <Input submitFn={submitFn} placeholder={"select"} buttonTitle={"Sumbit"} />
            <Clock time={time} cityCountry={timeZone} /> */}
        </div>
    )
}

export default Clocks