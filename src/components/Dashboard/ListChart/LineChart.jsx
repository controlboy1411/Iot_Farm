import { Chart } from "react-google-charts";
import { Spinner } from 'react-bootstrap';


const LineChart = (props) => {
    const { data, chartOptions } = props;
    
    return (
        <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<Spinner animation="grow" variant="success"/>}
            data={data}
            options={chartOptions}
        />
    )
}

export default LineChart