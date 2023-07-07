import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography, useTheme } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { employeesService } from "../../config/service-config"
import CodeType from "../../model/CodeType"
import Employee from "../../model/Employee"
import { authActions } from "../redux/slices/authSlice"
import { codeActions } from "../redux/slices/codeSlice"
import { useDispatch } from "react-redux"
import React from "react"
import Chart from "../common/Chart"
import { getStatistic } from "../../service/Statistics"

const AgeStatitics: React.FC = () => {

    const dispatch = useDispatch()
    const [ageStatistics, setAgeStatistics] = useState<any[]>([{ age: 0, count: 0, id: 0 }]);
    const [step, setStep] = useState(10);

    const handleChange = (event: SelectChangeEvent) => {
        setStep(+event.target.value);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'age', headerName: "Age", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'count', headerName: "Count", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' }
    ]

    useEffect(() => {
        const subscription = employeesService.getEmployees().subscribe({
            next(emplArray: Employee[] | string) {

                if (typeof emplArray === 'string') {
                    if (emplArray.includes('Authentication')) {
                        dispatch(codeActions.set({ message: emplArray, code: CodeType.AUTH_ERROR }))
                        dispatch(authActions.reset())
                    } else {
                        dispatch(codeActions.set({ message: emplArray, code: CodeType.SERVER_ERROR }))
                    }
                } else {
                    const fn = (employee: Employee) => new Date().getFullYear() - new Date(employee.birthDate).getFullYear()
                    const statistic = getStatistic(emplArray, 20, 100, step, fn, 'age')

                    setAgeStatistics(statistic);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [step])

    return (<Grid container spacing={2}>
        <Grid item xs={12} md={6} >
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: "50vh",
                    alignItems: 'center'
                }}
            >
                <FormControl sx={{ width: '10vw' }}>
                    <InputLabel id="demo-simple-select-label">Step</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={step.toString()}
                        label="Step"
                        onChange={handleChange}
                    >
                        {Array.from({ length: 100 / 20 }).map((_, count) => <MenuItem value={(count + 1) * 10}>{(count + 1) * 10}</MenuItem>)}
                    </Select>
                </FormControl>
                <Chart data={ageStatistics.map(s => { return { dataX: s.age, dataY: s.count } })}></Chart >
            </Paper>
        </Grid>
        <Grid item xs={12} md={6} >
            <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                <Box sx={{ height: '50vh', width: '80%' }}>
                    <DataGrid columns={columns} rows={ageStatistics} />
                </Box>
            </Box>
        </Grid>
    </Grid>)
}

export default AgeStatitics