import { Container, CssBaseline, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputResult from "../../model/InputResult";
import { useState } from "react";
import employeesConfig from "../../config/employees-config.json"
import Employee from "../../model/Employee";
import Confirm from "../common/Confirm";

const defaultTheme = createTheme();

const initialDate: any = '';
const initialGender: any = '';
const initialEmployee: Employee = {
    id: 0, birthDate: initialDate, name: '', department: '', salary: 0,
    gender: initialGender
};

type Props = {
    submitFn: (employee: Employee) => Promise<InputResult>
    employeeToUpdate?: Employee
}

const AddEmployeeForm: React.FC<Props> = ({ submitFn, employeeToUpdate }) => {

    const [dateLabelFocused, setDateLabelFocused] = useState(false);
    const [dateLabelIsEmpty, setDateLabelIsEmpty] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [employee, setEmployee] = useState<Employee>(employeeToUpdate || initialEmployee);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const result = await submitFn(employee);
        resetFn(event)
        closeDialog()
    };

    const resetFn = (event: any) => {
        event.preventDefault();
        setDateLabelIsEmpty(!employeeToUpdate)
        setEmployee(employeeToUpdate || initialEmployee);
    }

    const openDialog = (event: any) => {
        event.preventDefault();
        setSubmitted(true)
    }

    const closeDialog = () => {
        setSubmitted(false)
    }

    return (
        <ThemeProvider theme={defaultTheme} >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={openDialog} onReset={resetFn} sx={{ mt: 1 }}>
                        <TextField
                            onChange={e => setEmployee({ ...employee, name: e.target.value })}
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={employee.name || ''}
                        />
                        <TextField
                            onFocus={() => setDateLabelFocused(true)}
                            onBlur={() => setDateLabelFocused(false)}
                            onChange={e => {
                                setEmployee({ ...employee, birthDate: new Date(e.target.value) })
                                setDateLabelIsEmpty(e.target.value ? false : true)
                            }}
                            margin="normal"
                            required
                            fullWidth
                            disabled={!!employeeToUpdate}
                            name="birthDate"
                            label="Birth date"
                            type={!dateLabelIsEmpty || dateLabelFocused ? "date" : "text"}
                            id="BirthDate"
                            value={employee.birthDate ? employee.birthDate.toISOString().substring(0, 10) : ''}
                            InputProps={{ inputProps: { min: `${employeesConfig.minYear}-01-01`, max: `${employeesConfig.maxYear}-12-31` } }}
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="department-select-label">Department</InputLabel>
                            <Select
                                onChange={e => setEmployee({ ...employee, department: e.target.value })}
                                name="department"
                                labelId="department-label"
                                id="department-select"
                                label="Department"
                                value={employee.department || ''}
                            >
                                {employeesConfig.departments.map(dep => <MenuItem value={dep}>{dep}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            onChange={e => setEmployee({ ...employee, salary: +e.target.value })}
                            margin="normal"
                            required
                            fullWidth
                            name="salary"
                            label="Salary"
                            type="number"
                            value={employee.salary || ''}
                            InputProps={{ inputProps: { min: employeesConfig.minSalary * 1000, max: employeesConfig.maxSalary * 1000 } }}
                            id="Salary"
                        />
                        <FormControl required fullWidth disabled={!!employeeToUpdate}>
                            <FormLabel id="gender-label">Gender</FormLabel>
                            <RadioGroup
                                onChange={e => setEmployee({ ...employee, gender: e.target.value as "male" | "female" })}
                                aria-required
                                row
                                aria-labelledby="gender-label"
                                name="gender"
                                defaultValue="male"
                                value={employee.gender || ''}
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            // sx={{ mt: 3, mb: 2 }}
                            sx={{ m: 0.5 }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="reset"
                            fullWidth
                            variant="contained"
                            // sx={{ mt: 3, mb: 2 }}
                            sx={{ m: 0.5 }}
                        >
                            Reset
                        </Button>
                    </Box>
                    {submitted && <Confirm title={`${!!employeeToUpdate ? 'Update' : 'Add'} employee`} question={`Are you want to ${!!employeeToUpdate ? 'update' : 'add new '} employee?`} submitFn={handleSubmit} closeFn={closeDialog}></Confirm>}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default AddEmployeeForm