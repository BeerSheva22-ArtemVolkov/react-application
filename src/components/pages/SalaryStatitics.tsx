import Employee from "../../model/Employee"
import React from "react"
import Statitics from "../common/Statistics"
import employeeConfig from "../../config/employees-config.json"

const SalaryStatitics: React.FC = () => {

    return <Statitics
        field={"salary"}
        initStep={5000}
        minValue={employeeConfig.minSalary * 1000}
        maxValue={employeeConfig.maxSalary * 1000}
        filterFunction={(employee: Employee) => employee.salary}
    ></Statitics>
}

export default SalaryStatitics