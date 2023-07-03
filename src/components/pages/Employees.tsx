import { Alert, Box, Snackbar, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import Employee from "../../model/Employee";
import { authService, employeesService } from "../../config/service-config";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/slices/authSlice";
import { StatusType } from "../../model/StatusType";
import { codeActions } from "../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";

const Employees: React.FC = () => {

    const [employees, setEemployees] = useState<Employee[]>([]);
    const dispatch = useDispatch()
    const [alertMessage, setAlertMessage] = useState<string>('')
    const severity = useRef<StatusType>('error')

    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: "Name", flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'birthDate', type: 'date', headerName: "Date", flex: 1, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'department', headerName: "Department", flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'salary', type: "number", headerName: "Salary", flex: 0.6, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'gender', headerName: "Gender", flex: 0.4, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' }
    ]

    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {
                if (typeof emplArray === 'string') {
                    // FIXME
                    if (emplArray.includes('Authentication')) {
                        authService.logut();
                        dispatch(codeActions.set({ message: emplArray, code: CodeType.AUTH_ERROR }))
                        dispatch(authActions.reset())
                    } else {
                        dispatch(codeActions.set({ message: emplArray, code: CodeType.SERVER_ERROR }))
                    }
                } else {
                    setEemployees(emplArray.map(e => ({ ...e, birthDate: new Date(e.birthDate) })));
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [])


    return (<Box sx={{ justifyContent: 'center', display: 'flex' }}>
        <Box sx={{ height: '50vh', width: '80vw' }}>
            <DataGrid columns={columns} rows={employees} />
        </Box>
        {/* <Snackbar open={!!alertMessage} autoHideDuration={20000} onClose={() => setAlertMessage('')}>
            <Alert onClose={() => setAlertMessage('')} severity={severity.current} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar> */}
    </Box>)
}

export default Employees