import { Card, CardContent } from '@mui/material';
import { Chart, LineSeries, SplineSeries, ArgumentAxis, ScatterSeries, ValueAxis, Legend, Title, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { useState } from 'react';
import { symbol, symbolCross } from 'd3-shape';
import { Animation, EventTracker } from '@devexpress/dx-react-chart';
import { useReducerContext } from '../../services/ReducerProvider';

const generateData = (start, end, step) => {
    const data = [];
    for (let i = start; i < end; i += step) {
        data.push({ splineValue: Math.sin(i) / i, lineValue: ((i / 15) ** 2.718) - 0.2, argument: i });
    }

    return data;
};

const Point = (type, styles) => (props) => {
    const {
        arg, val, color,
    } = props;
    return (
        <path
            fill={color}
            transform={`translate(${arg} ${val})`}
            d={symbol().size([10 ** 2]).type(type)()}
            style={styles}
        />
    );
};

const costLabel = ({ text, style, ...restProps }) => (
    <ValueAxis.Label
        text={`$${text}`}
        style={{
            ...style,
        }}
        {...restProps}
    />
);

const CrossPoint = Point(symbolCross, {
    stroke: 'white',
    strokeWidth: '1px',
});

const LineWithCrossPoint = (props) => (
    <>
        <LineSeries.Path {...props} />
        <ScatterSeries.Path {...props} pointComponent={CrossPoint} />
    </>
)

const getGraphData = (data) => {
    return data.map(date => ({ 'lineValue': date.average_cost, 'argument': new Date(date.timeDate * 1000).toLocaleString() })).reverse()
}

const CostLineGraph = () => {
    const [chartData, setChartData] = useState(generateData(2.5, 12, 0.5))
    console.log(chartData)

    const [state,] = useReducerContext()

    const [currCategoryData, setCurrCategoryData] = useState(getGraphData(state.currCategory))

    console.log(currCategoryData)
    return (
        <Card sx={{ height: 'min-content' }}>
            <CardContent>
                <Chart data={currCategoryData} height={300}>
                    <ArgumentAxis text="Time" />
                    <ValueAxis labelComponent={costLabel} showLine />
                    <LineSeries name="Average Category Spend" valueField='lineValue' argumentField='argument' seriesComponent={LineWithCrossPoint} />
                    {/* <SplineSeries name="data 2" valueField='splineValue' argumentField='argument' seriesComponent={LineWithCrossPoint} /> */}
                    <EventTracker />
                    <Tooltip />
                    <Animation />
                    {/* <Legend /> */}
                    <Title text="Average Category Spend" />
                </Chart>
            </CardContent>
        </Card>
    )
}

export default CostLineGraph