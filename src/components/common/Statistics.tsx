import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
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

type Props = {
    field: string
    initStep: number
    minValue: number
    maxValue: number
    filterFunction(employee: Employee): number
}

function getStatistic(empl: Employee[], min: number, max: number, step: number, fn: (employee: Employee) => number, field: string) {
    let res: any[] = [];
    let k = 0;
    for (let i = min; i < max; i += step) {
        res[k++] = {
            id: k,
            [field]: `${i} - ${i + step > max ? max : i + step}`,
            count: empl.filter(employee => {
                const fieldValue = fn(employee)                
                return +fieldValue < i + step && +fieldValue > i
            }).length
        }
    }

    return res
}

const Statitics: React.FC<Props> = ({field, initStep, minValue, maxValue, filterFunction}) => {

    const dispatch = useDispatch()
    const [statistics, setStatistics] = useState<any[]>([{ field: 0, count: 0, id: 0 }]);
    const [step, setStep] = useState(initStep);

    const handleChange = (event: SelectChangeEvent) => {
        setStep(+event.target.value);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field, headerName: field.charAt(0).toUpperCase() + field.slice(1), flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
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
                    const statistic = getStatistic(emplArray, minValue, maxValue, step, filterFunction, field)
                    setStatistics(statistic);
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
                        {Array.from({ length: maxValue / minValue }).map((_, count) => <MenuItem value={(count + 1) * initStep}>{(count + 1) * initStep}</MenuItem>)}
                    </Select>
                </FormControl>
                <Chart data={statistics.map(s => { return { dataX: s[field], dataY: s.count } })} fieldName={field}></Chart >
            </Paper>
        </Grid>
        <Grid item xs={12} md={6} >
            <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                <Box sx={{ height: '50vh', width: '80%' }}>
                    <DataGrid columns={columns} rows={statistics} />
                </Box>
            </Box>
        </Grid>
    </Grid>)
}

export default Statitics