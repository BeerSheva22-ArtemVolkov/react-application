import { Box, Modal } from "@mui/material"
import { useEffect, useState } from "react"
import Employee from "../../model/Employee";
import { authService, employeesService } from "../../config/service-config";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/slices/authSlice";
import { codeActions } from "../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CodePayload from "../../model/CodePayload";
import Confirm from "../common/Confirm";
import InputResult from "../../model/InputResult";
import UserData from "../../model/UserData";
import EmployeeForm from "../forms/EmployeeForm";

type Props = {
    user: UserData
}

const Employees: React.FC<Props> = ({ user }) => {

    const [employees, setEemployees] = useState<Employee[]>([]);
    const dispatch = useDispatch()

    const [deleteDialogOpened, setDeleteDialogOpened] = useState(false)
    const [deletedID, setDeletedID] = useState('')
    const [editedEmployee, setEditedEmployee] = useState<Employee>()
    const [editDialogOpened, setEditDialogOpened] = useState(false)

    const openDeleteDialog = (deletedID: any) => {
        setDeletedID(deletedID)
        setDeleteDialogOpened(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpened(false)
    }

    const openEditDialog = (editLabel: any) => {
        console.log(editLabel);

        setEditedEmployee({ ...editLabel.row, id: editLabel.id as number })
        setEditDialogOpened(true)
    }

    const closeEditDialog = () => {
        setEditDialogOpened(false)
    }

    const deleteUser = async (event: any) => {
        event.preventDefault();
        let res: CodePayload = { code: CodeType.OK, message: `employee with id=${deletedID} was deleted` }
        try {
            await employeesService.deleteEmployee(deletedID)
        } catch (error: any) {
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                res.code = CodeType.AUTH_ERROR
                await authService.logout();
                dispatch(authActions.reset());
            } else {
                res.code = CodeType.SERVER_ERROR
            }
            res.message = error
        }
        dispatch(codeActions.set(res))
        closeDeleteDialog();
    }

    const editUser = async (employee: Employee) => {

        let res: CodePayload = { code: CodeType.OK, message: `employee with id=${employee.id} was edited` }
        let editedEmployee = null;
        try {
            editedEmployee = await employeesService.updateEmployee(employee)
        } catch (error: any) {
            if ((typeof (error) == 'string') && error.includes('Authentication')) {
                res.code = CodeType.AUTH_ERROR
                authService.logout();
                dispatch(authActions.reset());
            } else {
                res.code = CodeType.SERVER_ERROR
            }
            res.message = error
        }

        dispatch(codeActions.set(res))
        closeEditDialog();
        const result: InputResult = { status: editedEmployee ? "success" : "error", message: res.message }

        return result
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: "Name", flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'birthDate', type: 'date', headerName: "Date", flex: 1, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'department', headerName: "Department", flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'salary', type: "number", headerName: "Salary", flex: 0.6, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'gender', headerName: "Gender", flex: 0.4, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
    ]

    const actionsColumn: GridColDef = {
        field: 'actions', type: 'actions', getActions: (params: GridRowParams) => [
            <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => openDeleteDialog(params.id)} />,
            <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => openEditDialog(params)} />
        ]
    }

    function getColumns(role: string) {
        const res = columns;
        if (role == 'admin') {
            res.push(actionsColumn)
        }
        return res
    }

    // обсервер - постоянный стрим событий
    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {

                if (typeof emplArray === 'string') {

                    // if (emplArray.includes('Authentication')) {
                    if (emplArray.includes('Unauthorized')) {
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
            <DataGrid columns={getColumns(user?.role ? user.role : '')} rows={employees} />
        </Box>
        <Modal open={deleteDialogOpened} >
            <Box>
                <Confirm title={"Delete employee"} question={"Are you shure?"} submitFn={deleteUser} closeFn={closeDeleteDialog}></Confirm>
            </Box>
        </Modal>
        <Modal open={editDialogOpened} onClose={closeEditDialog}>
            <Box sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <EmployeeForm submitFn={editUser} employeeToUpdate={editedEmployee} ></EmployeeForm>
            </Box>
        </Modal >
    </Box >)
}

export default Employees