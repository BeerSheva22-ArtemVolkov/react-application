import { useState } from "react"
import timeZones from "../data/time-zones"

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

interface SelectTimeZoneProps {
    setTimeZone: (timeZone: string) => void
    setTimeZoneName: (timeZoneName: string) => void
}

export function SelectTimeZone({ setTimeZone, setTimeZoneName }: SelectTimeZoneProps) {

    const [value, setValue] = useState('')

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const objects: Array<TimeZoneObj> = Array.from(timeZones).filter(obj => obj.name.replace('_', ' ').toLocaleLowerCase().includes(value.toLocaleLowerCase()) || obj.alternativeName.toLocaleLowerCase().includes(value.toLocaleLowerCase()))

        if (objects.length) {
            setTimeZone(objects[0].name);
            setTimeZoneName(value);
        }
    } 

    return (
        <form onSubmit={submitHandler}>
            <input
                type="text"
                placeholder="Enter time zone..."
                value={value}
                onChange={event => setValue(event.target.value)}
            />
            <button type="submit">Select</button>
        </form>
    )
}