import { useReducerContext } from '../../services/ReducerProvider';
import { Card, CardContent, Grid } from "@mui/material";
import PieChartComponent from './PieChart';

//TODO: refactor this and categoryPage into one component
const CategoriesPieChart = () => {

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <PieChartComponent />
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CategoriesPieChart;