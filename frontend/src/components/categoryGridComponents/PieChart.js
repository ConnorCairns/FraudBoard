import PieChart, { Series, Label, Legend, Export } from 'devextreme-react/pie-chart';
import { Grid } from "@mui/material";
import { useReducerContext } from '../../services/ReducerProvider';
import { useEffect, useRef } from 'react';

const getPieChartData = (data) => {
    let pieChartData = []
    let websiteCount = []

    for (let category in data) {
        pieChartData.push({ name: category, area: data[category][0].total_spent.toFixed(2) })
        websiteCount.push({ name: category, area: data[category][0].count })
    }

    return [{ title: 'Total Spent', dataSource: pieChartData }, { title: 'Dataset Count', dataSource: websiteCount }]
}

const PieChartComponent = ({ removeHovered, setHovered }) => {
    const [state,] = useReducerContext();

    const pieChartData = getPieChartData(state.otherCategories)

    return (
        <>
            {
                pieChartData.map((options, idx) => (
                    <Grid key={idx} item xs={12} sm={6} lg={6}>
                        <PieChart sx={{ margin: 'auto' }}  title={options.title} key={idx} dataSource={options.dataSource} sizeGroup="piesGroup">
                            <Series argumentField="name" valueField="area" >
                                <Label visible={true} customizeText={(arg) => idx === 0 ? `$${arg.valueText} (${arg.percentText})` : `${arg.valueText} (${arg.percentText})`} />
                            </Series >
                            <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="right" />
                            <Export enabled={true} />
                        </PieChart >
                    </Grid>
                ))
            }
        </>
    )
}

export default PieChartComponent