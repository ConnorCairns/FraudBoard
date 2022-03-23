import PieChart, { Series, Label, Legend } from 'devextreme-react/pie-chart';
import { Grid } from "@mui/material";
import { useReducerContext } from '../../services/ReducerProvider';

const getPieChartData = (data) => {
    let pieChartData = []
    let websiteCount = []

    for (let category in data) {
        pieChartData.push({ name: category, area: data[category].total_spent.toFixed(2) })
        websiteCount.push({ name: category, area: data[category].count })
    }

    return [{ title: 'Total Spent', dataSource: pieChartData }, { title: 'Dataset Count', dataSource: websiteCount }]
}

const PieChartComponent = ({ options, idx }) => {
    const [state,] = useReducerContext();

    const pieChartData = getPieChartData(state.otherCategories)

    return (
        <>
            {
                pieChartData.map((options, idx) => (
                    <Grid key={idx} item xs={12} sm={6} lg={6}>
                        <PieChart sx={{ margin: 'auto' }} title={options.title} key={idx} dataSource={options.dataSource} sizeGroup="piesGroup">
                            < Series argumentField="name" valueField="area" >
                                <Label visible={true} customizeText={(arg) => idx == 0 ? `$${arg.valueText} (${arg.percentText})` : `${arg.valueText} (${arg.percentText})`} />
                            </Series >
                            <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="right" />
                        </PieChart >
                    </Grid>
                ))
            }
        </>
    )
}

export default PieChartComponent