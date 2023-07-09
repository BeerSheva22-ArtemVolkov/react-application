import EmployeeForm from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import Employee from "../../model/Employee";
import { employeesService } from "../../config/service-config";
import { useDispatch } from "react-redux";
import CodePayload from "../../model/CodePayload";
import CodeType from "../../model/CodeType";
import { codeActions } from "../redux/slices/codeSlice";

const AddEmployee: React.FC = () => {
    const dispatch = useDispatch();
    const codeMessage: CodePayload = { code: CodeType.OK, message: '' };
    async function submitFn(empl: Employee): Promise<InputResult> {
        const res: InputResult = { status: 'success', message: '' };
        try {
            const employee: Employee = await employeesService.addEmployee(empl);
            codeMessage.message = `employee with id: ${employee.id} has been added`
        } catch (error: any) {
            res.status = 'error';

            if (error.includes('Authentication')) {
                codeMessage.code = CodeType.AUTH_ERROR;
                codeMessage.message = ''

            }
            codeMessage.message = error;
        }
        dispatch(codeActions.set(codeMessage))
        return res;
    }
    return <EmployeeForm submitFn={submitFn} />
}
export default AddEmployee