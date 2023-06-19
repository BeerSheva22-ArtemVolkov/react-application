import { CSSProperties, useEffect, useMemo, useState } from "react"
import timeZones from '../data/time-zones';
import InputResult from "../model/InputResult";
import Input from "./common/Input";

type Props = {
    time: Date
    cityCountry: string
}

interface TimeZoneObj {
    name: string,
    alternativeName: string,
    group: string[],
    continentCode: string,
    continentName: string,
    countryName: string,
    countryCode: string,
    mainCities: string[],
    rawOffsetInMinutes: number,
    rawFormat: string
}

const style: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center" } // используем ts

function getTimeZone(cityCountry: string): string | undefined {
    const timeZoneObj =
        timeZones.find(tz => JSON.stringify(tz).includes(cityCountry));
    return timeZoneObj?.name;
}

export const Clock: React.FC<Props> = ({ time, cityCountry }) => {

    const [cC, setCityCountry] = useState(cityCountry)

    let timeZone: string | undefined = useMemo(() => getTimeZone(cC), [cC])
    const title: string = timeZone || 'Israel';
    let timeStr: string = time.toLocaleTimeString(undefined, { timeZone })

    function submitFn(value: string): InputResult {

        const objects: Array<TimeZoneObj> = timeZones.filter(obj => obj.name.replace('_', ' ').toLocaleLowerCase().includes(value.toLocaleLowerCase()) || obj.alternativeName.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
        let res: InputResult = { status: "success", message: "found" };
        if (objects.length > 0) {
            if (objects.length > 1) {
                res = { status: "warning", message: "found more than 1" };
            }
            setCityCountry(getTimeZone(objects[0].name)!)
        } else {
            res = { status: "error", message: "not found" };
        }

        return res
    }


    return <div style={style}>
        <Input submitFn={submitFn} placeholder={"select"} buttonTitle={"Sumbit"} />
        <header>
            <p>Time in {title}</p>
        </header>
        <p>{timeStr}</p>
    </div>
}