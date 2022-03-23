import { Card, CardContent, Grid } from "@mui/material";
import PieChartComponent from './PieChart';
import PieChartExpand from "./PieChartExpand";

//TODO: refactor this and categoryPage into one component
const CategoriesPieChart = () => {

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <PieChartComponent />
        </Grid>
      </CardContent>
      <PieChartExpand />
    </Card>
  )
}

export default CategoriesPieChart;