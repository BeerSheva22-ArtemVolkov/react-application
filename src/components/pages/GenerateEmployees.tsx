import { useDispatch } from "react-redux";
import { employeesService, authService } from "../../config/service-config";
import Employee from "../../model/Employee";
import InputResult from "../../model/InputResult";
import { authActions } from "../redux/slices/authSlice";
import GenerateEmployeeForm from "../forms/GenerateEmployeeForm";
import { getRandomEmployee } from "../../util/random";
import employeeConfig from "../../config/employees-config.json"

const GenerateEmployees: React.FC = () => {
    const dispatch = useDispatch()

    function submitFn(count: string): InputResult {
        let res: InputResult = { status: "success" };
        // try {
        // console.log(dispatch(authActions.get()));

        const employees: Employee[] = Array.from({ length: +count }).map(() => getRandomEmployee(employeeConfig.minSalary, employeeConfig.maxSalary, employeeConfig.minYear, employeeConfig.maxYear, employeeConfig.departments))
        res.message = `<${count}> employees ${+count > 1 ? 'were' : 'was'} added`
        employees.forEach(async empl => {
            try {
                await employeesService.addEmployee(empl)
            } catch (error: any) {
                res.status = 'error';
                console.log(error);
                res.message = error;
                if ((typeof (error) == 'string')) {
                    await authService.logout();
                    dispatch(authActions.reset());
                }
            }
        })
        // } catch (error: any) {
        //     res.status = 'error';
        //     console.log(error);
        //     if ((typeof (error) == 'string') && error.includes('Authentication')) {
        //         authService.logout();
        //         dispatch(authActions.reset());
        //         res.message = ""
        //     }
        //     res.message = error;
        // }
        console.log(res);

        return res;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <GenerateEmployeeForm submitFn={submitFn} ></GenerateEmployeeForm>
        </div>
    )
}

export default GenerateEmployees