import Employee from "../../model/Employee"
import InputResult from "../../model/InputResult"
import Input from "../common/Input"

type Props = {
    submitFn(count: string): InputResult
}

const GenerateEmployeeForm: React.FC<Props> = ({submitFn}) => {
    return <Input submitFn={submitFn} placeholder={"Enter # of employees"} type="number" buttonTitle="Generate"></Input>
}

export default GenerateEmployeeForm