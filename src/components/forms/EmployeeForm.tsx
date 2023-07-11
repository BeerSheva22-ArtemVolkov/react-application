import React, { useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Switch } from '@mui/material';
import Employee from "../../model/Employee";
import employeeConfig from "../../config/employees-config.json"
import InputResult from "../../model/InputResult";

type Props = {
    submitFn: (empl: Employee) => Promise<InputResult>
    employeeUpdated?: Employee
    watchMode?: string
    deleteFn?: (id: any) => void
}

const initialDate: any = 0;
const initialGender: any = '';
const initialEmployee: Employee = {
    id: 0,
    birthDate: initialDate,
    name: '',
    department: '',
    salary: 0,
    gender: initialGender
};

export const EmployeeForm: React.FC<Props> = ({ submitFn, employeeUpdated, watchMode, deleteFn }) => {

    const { minYear, minSalary, maxYear, maxSalary, departments } = employeeConfig;
    const [employee, setEmployee] = useState<Employee>(employeeUpdated || initialEmployee);
    const [errorMessage, setErrorMessage] = useState('');
    const [enableEdit, setEnableEdit] = React.useState(watchMode != 'user');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnableEdit(!enableEdit);
    };

    function handlerName(event: any) {
        const name = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.name = name;
        setEmployee(emplCopy);
    }

    function handlerBirthdate(event: any) {
        const birthDate = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.birthDate = new Date(birthDate);
        setEmployee(emplCopy);
    }

    function handlerSalary(event: any) {
        const salary: number = +event.target.value;
        const emplCopy = { ...employee };
        emplCopy.salary = salary;
        setEmployee(emplCopy);
    }

    function handlerDepartment(event: any) {
        const department = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.department = department;
        setEmployee(emplCopy);
    }

    function genderHandler(event: any) {
        setErrorMessage('');
        const gender: 'male' | 'female' = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.gender = gender;
        setEmployee(emplCopy);
    }

    async function onSubmitFn(event: any) {
        event.preventDefault();
        if (!employee.gender) {
            setErrorMessage("Please select gender")
        } else {
            const res = await submitFn(employee);
            res.status == "success" && event.target.reset();
        }
    }

    function onResetFn(event: any) {
        setEmployee(employeeUpdated || initialEmployee);
    }

    return <Box sx={{ marginTop: { sm: "25vh" } }}>
        {watchMode === 'admin' && <Switch
            checked={enableEdit}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />}
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5}>
                    {enableEdit ?
                        <FormControl fullWidth required >
                            <InputLabel id="select-department-id">Department</InputLabel>
                            <Select
                                labelId="select-department-id"
                                label="Department"
                                value={employee.department}
                                onChange={handlerDepartment}>
                                <MenuItem value=''>None</MenuItem>
                                {departments.map(dep => <MenuItem value={dep} key={dep}>{dep}</MenuItem>)}
                            </Select>
                        </FormControl>
                        :
                        <TextField
                            type="text"
                            fullWidth
                            label="Department"
                            value={employee.department}
                            inputProps={{
                                readOnly: true
                            }}
                        />}
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField
                        type="text"
                        required={enableEdit}
                        fullWidth
                        label="Employee name"
                        helperText={enableEdit ? "enter Employee name" : ''}
                        onChange={handlerName}
                        value={employee.name}
                        inputProps={{
                            readOnly: !!employeeUpdated
                        }}
                    />
                </Grid>
                <Grid item xs={8} sm={4} md={5}>
                    <TextField
                        type="date"
                        required={enableEdit}
                        fullWidth
                        label="birthDate"
                        value={employee.birthDate ? employee.birthDate.toISOString().substring(0, 10) : ''}
                        inputProps={{
                            readOnly: !!employeeUpdated,
                            min: `${minYear}-01-01`,
                            max: `${maxYear}-12-31`
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={handlerBirthdate}
                    />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="salary"
                        fullWidth
                        required={enableEdit}
                        type="number"
                        onChange={handlerSalary}
                        value={employee.salary || ''}
                        helperText={enableEdit ? `enter salary in range [${minSalary}-${maxSalary}]` : ''}
                        inputProps={{
                            readOnly: !enableEdit,
                            min: `${minSalary}`,
                            max: `${maxSalary}`
                        }}
                    />
                </Grid>
                <Grid item xs={8} sm={4} md={5}>
                    {enableEdit ?
                        <FormControl required error={!!errorMessage}>
                            <FormLabel id="gender-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="gender-group-label"
                                defaultValue=""
                                value={employee.gender || ''}
                                name="radio-buttons-group"
                                row onChange={genderHandler}
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" disabled={!!employeeUpdated} />
                                <FormControlLabel value="male" control={<Radio />} label="Male" disabled={!!employeeUpdated} />
                                <FormHelperText>{errorMessage}</FormHelperText>
                            </RadioGroup>
                        </FormControl>
                        :
                        <TextField label="Gender"
                            fullWidth
                            type="text"
                            value={employee.gender}
                            inputProps={{
                                readOnly: true
                            }}
                        />}
                </Grid>
            </Grid>

            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                {enableEdit && <Button type="submit">Submit</Button>}
                {enableEdit && <Button type="reset">Reset</Button>}
                {watchMode == 'admin' && <Button type="button" onClick={() => deleteFn?.(employeeUpdated!.id)}>Delete User</Button>}
            </Box>
        </form>

    </Box>
}