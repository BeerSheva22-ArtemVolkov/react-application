import { Container, CssBaseline, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputResult from "../../model/InputResult";
import { useRef, useState } from "react";
import employeesConfig from "../../config/employees-config.json"
import Employee from "../../model/Employee";
import { useDispatch } from "react-redux";
import { codeActions } from "../redux/slices/codeSlice";
import CodeType from "../../model/CodeType";
import Confirm from "../common/Confirm";

const defaultTheme = createTheme();

type Props = {
    submitFn: (employee: Employee) => Promise<InputResult>
}

const AddEmployeeForm: React.FC<Props> = ({ submitFn }) => {

    const dispatch = useDispatch()
    const inputRef = useRef<any>('')

    const [department, setDepartment] = useState<string>('')
    const [dateLabelFocused, setDateLabelFocused] = useState(false);
    const [dateLabelIsEmpty, setDateLabelIsEmpty] = useState(true);
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const data = new FormData(inputRef.current);
        const name: string = data.get('name')! as string;
        const birthDate: Date = new Date(data.get('birthDate')! as string);
        const department: string = data.get('department')! as string;
        const salary: number = +(data.get('salary')!) as number;
        const gender: "male" | "female" = data.get('gender')! as "male" | "female";

        const result = await submitFn({ name, birthDate, department, salary, gender });

        result.status == 'success' && inputRef.current.reset();
        // message.current = result.message!;
        // status.current = result.status;
        dispatch(codeActions.set({ message: result.message, code: result.status == "success" ? CodeType.OK : CodeType.UNKNOWN }))
        // message.current && setOpen(true)
        // setTimeout(() => setOpen(false), 5000)
        closeDialog()
    };

    const departmentChange = (event: SelectChangeEvent) => {
        setDepartment(event.target.value as string);
    };

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
                    <Typography component="h1" variant="h5">
                        Add employee
                    </Typography>
                    <Box component="form" onSubmit={openDialog} sx={{ mt: 1 }} ref={inputRef}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            onFocus={() => setDateLabelFocused(true)}
                            onBlur={() => setDateLabelFocused(false)}
                            onChange={e => setDateLabelIsEmpty(e.target.value ? false : true)}
                            margin="normal"
                            required
                            fullWidth
                            name="birthDate"
                            label="Birth date"
                            type={!dateLabelIsEmpty || dateLabelFocused ? "date" : "text"}
                            id="BirthDate"
                            InputProps={{ inputProps: { min: (new Date(employeesConfig.minYear, 0, 0)).toISOString().split("T")[0], max: (new Date(employeesConfig.maxYear, 0, 0)).toISOString().split("T")[0] } }}
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
                                defaultValue="male"
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add new employee
                        </Button>
                    </Box>
                    {submitted && <Confirm title={"Add new employee"} question={"Are you shure?"} submitFn={handleSubmit} closeFn={closeDialog}></Confirm>}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default AddEmployeeForm