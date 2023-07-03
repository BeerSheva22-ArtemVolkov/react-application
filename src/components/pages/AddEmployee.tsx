import AddEmployeeForm from "../forms/AddEmployeeForm";
import InputResult from "../../model/InputResult";
import Employee from "../../model/Employee";
import { authService, employeesService } from "../../config/service-config";
import { authActions } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const AddEmployee: React.FC = () => {

    const dispatch = useDispatch()
    
    async function submitFn(employee: Employee): Promise<InputResult> {
        let res: InputResult = { status: "success" };
        try {
            const empl: Employee = await employeesService.addEmployee(employee)
            res.message = `employee with id=${empl.id} was added`
        } catch (error: any) {
            res.status = 'error';
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                authService.logout();
                dispatch(authActions.reset());
                res.message = ""
            }
            res.message = error;
        }
        return res;
    }

    return (
        <AddEmployeeForm submitFn={submitFn} ></AddEmployeeForm>
    )
}

export default AddEmployee