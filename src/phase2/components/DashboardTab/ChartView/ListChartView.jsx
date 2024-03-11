import { useEffect, useState } from 'react';
import ChartView from './ChartView.jsx';
import * as api from '../../../../api/api';
import { ChartConfig } from '../../../../config/app.config.js';
import dayjs from 'dayjs';


const tempPointsInit = []
const humiPointsInit = []
const co2PointsInit = []
const nh3PointsInit = []

for (let i = 0; i < 24; i++) {
    tempPointsInit.push({x: i, y: 0})
    humiPointsInit.push({x: i, y: 0})
    co2PointsInit.push({x: i, y: 0})
    nh3PointsInit.push({x: i, y: 0})
}

const ListChartView = (props) => {
    const { houseId, dateSelect } = props
    
    const [tempDataPoints, setTempDataPoints] = useState(tempPointsInit)
    const [humiDataPoints, setHumiDataPoints] = useState(humiPointsInit)
    const [co2DataPoints, setCo2DataPoints] = useState(co2PointsInit)
    const [nh3DataPoints, setNh3DataPoints] = useState(nh3PointsInit)

    useEffect(() => {
        const fetchData = async () => {
            const lineChartData = await api.getLineChartDataV2(houseId, dayjs(dateSelect).format('YYYY-MM-DD'))
            const lineChartResult = lineChartData.data?.data
            setTempDataPoints(lineChartResult.temp)
            setHumiDataPoints(lineChartResult.humi)
            setCo2DataPoints(lineChartResult.co2)
            setNh3DataPoints(lineChartResult.nh3)
        }

        fetchData()
    }, [houseId, dateSelect])

    return (
        <div className="mt-3 mb-4 list-chart-container">
            <div className='d-flex flex-column'>
                <div className='row mb-2'>
                    <div className='col list-chart-view-item'>
                        <ChartView 
                            chartType={ChartConfig.ChartType.Temp}
                            points={tempDataPoints}
                        />
                    </div>
                    <div className='col list-chart-view-item'>
                        <ChartView 
                            chartType={ChartConfig.ChartType.Humi}
                            points={humiDataPoints}
                        />
                    </div>
                </div>
                <div className='row mb-2'>
                    <div className='col list-chart-view-item'>
                        <ChartView 
                            chartType={ChartConfig.ChartType.CO2}
                            points={co2DataPoints}
                        />
                    </div>
                    <div className='col list-chart-view-item'>
                        <ChartView 
                            chartType={ChartConfig.ChartType.NH3}
                            points={nh3DataPoints}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListChartView;