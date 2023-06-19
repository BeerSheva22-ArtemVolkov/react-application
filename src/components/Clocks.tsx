import { useEffect, useState } from "react";
import { Clock } from "./Clock"
import { SelectTimeZone } from "./SelectTimeZone";
import Input from "./common/Input";
import InputResult from "../model/InputResult";
import timeZones from "../data/time-zones"
import { log, time } from "console";
import startCountries from "../data/startCountries.json"
import '../App.css'

const Clocks: React.FC = () => {

    const [time, setTime] = useState<Date>(new Date()) //задает начальное значение time

    useEffect(() => {
        console.log('mounting of clocks');
        const intervalID = setInterval(() => {
            setTime(new Date())
            console.log("intrval");
        }, 1000);
        return () => {
            console.log('unmounting of clocks');
            clearInterval(intervalID)
        }
    }, []) // пустой массив - нет зависимостей

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            {startCountries.map((x, index) => {
                return (<Clock time={time} cityCountry={x.city} key={index} />)
            })}
        </div>
    )
}

export default Clocks