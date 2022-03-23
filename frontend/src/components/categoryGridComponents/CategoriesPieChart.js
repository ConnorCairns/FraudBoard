import { Card, CardContent, Grid } from "@mui/material";
import { useState } from "react";
import PieChartComponent from './PieChart';
import PieChartExpandTable from "./PieChartExpandTable";

//TODO: refactor this and categoryPage into one component
const CategoriesPieChart = () => {
  const [hovered, setHovered] = useState();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <PieChartComponent setHovered={(point) => setHovered(point)}/>
        </Grid>
      </CardContent>
      <CardContent>
        <PieChartExpandTable removeHovered={() => setHovered(null)} setHovered={(category) => setHovered(category)}/>
      </CardContent>
    </Card>
  )
}

export default CategoriesPieChart;