import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';

type Props = {
    data: { dataX: string, dataY: number }[]
}

const Chart: React.FC<Props> = ({ data }) => {
    const theme = useTheme();
    console.log(data);
    
    console.log(Object.keys(data[0]));
    
    return (
        <React.Fragment>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey={Object.keys(data[0])[0]}
                        // dataKey='dataX'
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        dataKey={Object.keys(data[0])[1]}
                        // dataKey='dataY'
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            ...
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey={Object.keys(data[0])[1]}
                        // dataKey='dataY'
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}

export default Chart