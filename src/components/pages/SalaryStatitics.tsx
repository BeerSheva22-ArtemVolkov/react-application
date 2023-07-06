import { Box, Grid, Paper, Typography, useTheme } from "@mui/material"
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

const SalaryStatitics: React.FC = () => {

    const dispatch = useDispatch()
    const [salaryStatistics, setSalaryStatistics] = useState<any[]>([{salary: 0, count: 0, id: 0}]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.3, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'salary', headerName: "Salary", flex: 0.7, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' },
        { field: 'count', headerName: "Count", flex: 1, headerClassName: 'data-grid-header', align: 'center', headerAlign: 'center' }
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
                    const fn = (employee: Employee) => employee.salary
                    const statistic = getStatistic(emplArray, 5000, 50000, 5000, fn, 'salary')
                    setSalaryStatistics(statistic);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [])

    return (<Grid container spacing={2}>
        <Grid item xs={12} md={6} >
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                }}
            >
                <Chart data={salaryStatistics.map(s => { return { dataX: s.salary, dataY: s.count } })}></Chart >
            </Paper>
        </Grid>
        <Grid item xs={12} md={6} >
            <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                <Box sx={{ height: '50vh', width: '80%' }}>
                    <DataGrid columns={columns} rows={salaryStatistics} />
                </Box>
            </Box>
        </Grid>
    </Grid>)
}

export default SalaryStatitics