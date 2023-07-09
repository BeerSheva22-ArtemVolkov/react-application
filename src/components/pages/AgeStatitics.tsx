import Employee from "../../model/Employee"
import React from "react"
import Statitics from "../common/Statistics"

const AgeStatitics: React.FC = () => {

    return <Statitics
        field={"age"}
        initStep={10}
        minValue={20}
        maxValue={100}
        filterFunction={(employee: Employee) => new Date().getFullYear() - new Date(employee.birthDate).getFullYear()}
    ></Statitics>
}

export default AgeStatitics