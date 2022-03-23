import { Chart, PieSeries, Title, } from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { useReducerContext } from '../../services/ReducerProvider';

//TODO: refactor this and categoryPage into one component

const data = [
  { country: 'Russia', area: 12 },
  { country: 'Canada', area: 7 },
  { country: 'USA', area: 7 },
  { country: 'China', area: 7 },
  { country: 'Brazil', area: 6 },
  { country: 'Australia', area: 5 },
  { country: 'India', area: 2 },
  { country: 'Others', area: 50 },
];

const CategoriesPieChart = () => {
  const [state,] = useReducerContext();

  console.log(state.otherCategories)

  return (
    <Chart data={data} >
      <PieSeries
        valueField="area"
        argumentField="country"
      />
      <Title
        text="Area of Countries"
      />
      <Animation />
    </Chart>
  )
}

export default CategoriesPieChart;