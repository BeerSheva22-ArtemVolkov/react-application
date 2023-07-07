import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import InputResult from '../../model/InputResult'
import employeesConfig from "../../config/employees-config.json"
import Employee from '../../model/Employee'
import { codeActions } from '../redux/slices/codeSlice'
import { useDispatch } from 'react-redux'
import CodeType from '../../model/CodeType'
import Modal from '@mui/material/Modal';

type Props = {
    title: string
    labels: Employee
    submitFn: (employee: Employee) => Promise<InputResult>
    closeFn: () => void
}

const EditEmployee: React.FC<Props> = ({ title, labels, submitFn, closeFn }) => {

    const dispatch = useDispatch()
    const [department, setDepartment] = useState<string>(labels.department)
    const inputRef = useRef<any>('')

    const departmentChange = (event: SelectChangeEvent) => {
        setDepartment(event.target.value as string);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const data = new FormData(inputRef.current);
        const name: string = data.get('name')! as string;
        const birthDate: Date = new Date(data.get('birthDate')! as string);
        const department: string = data.get('department')! as string;
        const salary: number = +(data.get('salary')!) as number;
        const gender: "male" | "female" = data.get('gender')! as "male" | "female";

        const result = await submitFn({ id: labels.id, name, birthDate, department, salary, gender });

        dispatch(codeActions.set({ message: result.message, code: result.status == "success" ? CodeType.OK : CodeType.UNKNOWN }))
    };

    return <div>
        <Modal open={true}>
            <Box sx={{ backgroundColor: 'white', margin: '25vh', padding: '2vh' }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} ref={inputRef} >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        value={labels.name}
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        value={new Date(labels.birthDate).toISOString().split('T')[0]}
                        name="birthDate"
                        label="Birth date"
                        type="date"
                        id="BirthDate"
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="department-select-label">Department</InputLabel>
                        <Select
                            name="department"
                            labelId="department-label"
                            id="department-select"
                            label="Department"
                            value={department}
                            onChange={departmentChange}
                        >
                            {employeesConfig.departments.map(dep => <MenuItem value={dep}>{dep}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="salary"
                        label="Salary"
                        type="number"
                        defaultValue={labels.salary}
                        InputProps={{ inputProps: { min: employeesConfig.minSalary * 1000, max: employeesConfig.maxSalary * 1000 } }}
                        id="Salary"
                    />
                    <FormControl required>
                        <FormLabel id="gender-label">Gender</FormLabel>
                        <RadioGroup
                            aria-required
                            row
                            aria-labelledby="gender-label"
                            name="gender"
                            value={labels.gender}
                            aria-readonly
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                    <Box>
                        <Button variant="contained" sx={{ width: "50%" }} type='submit'>Submit</Button>
                        <Button variant="contained" sx={{ width: "50%" }} onClick={closeFn}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    </div >
}

export default EditEmployee