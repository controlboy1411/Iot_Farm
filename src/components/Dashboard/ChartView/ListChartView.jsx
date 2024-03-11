import { useEffect, useState } from "react";
import ChartView from "./ChartView";
import * as api from "../../../api/api";
import { getNearestHours } from "../../../utils/helper";
import { ChartConfig } from '../../../config/app.config.js';

const getDistanceMinutes = () => {
    return window.innerWidth >= 1150 ? ChartConfig.DistanceMinutes : ChartConfig.DistanceMinutes * 2
}

const ListChartView = (props) => {
    const { houseId } = props
    const initDistanceMinutes = getDistanceMinutes()
    const numberOfPoint = Math.ceil(ChartConfig.NumberMinutes / initDistanceMinutes) + 1
    const initChartValue = new Array(numberOfPoint).fill('0.00')
    const initNearestHours = getNearestHours(ChartConfig.NumberMinutes, initDistanceMinutes)

    const [nearestHours, setNearestHours] = useState(initNearestHours)
    const [chartData, setChartData] = useState({temp: initChartValue, humi: initChartValue, co2: initChartValue, nh3: initChartValue})   
    const [distanceMinutes, setDistanceMinutes] = useState(initDistanceMinutes)

    window.addEventListener('resize', () => {
        setDistanceMinutes(getDistanceMinutes())
    })

    useEffect(() => {
        const fetchData = async () => {
            const nearestHoursReset = getNearestHours(ChartConfig.NumberMinutes, distanceMinutes)
            const lineChartData = await api.getLineChartData(houseId, nearestHoursReset, distanceMinutes)
            const lineChartResult = lineChartData.data?.data
            setNearestHours(nearestHoursReset)
            setChartData(lineChartResult)
        };

        fetchData();
    }, [houseId, distanceMinutes])

    return (
        <div className="mt-3 mb-4 list-chart-container">
            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                <div className="col d-flex justify-content-center align-items-center">
                    <ChartView 
                        chartType={ChartConfig.ChartType.Temp}
                        points={nearestHours.map((hour, index) => {
                            return {
                                x: new Date(hour),
                                y: Number(chartData.temp[index])
                            }
                        })}
                    />
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <ChartView 
                        chartType={ChartConfig.ChartType.Humi}
                        points={nearestHours.map((hour, index) => {
                            return {
                                x: new Date(hour),
                                y: Number(chartData.humi[index])
                            }
                        })}
                    />
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <ChartView 
                        chartType={ChartConfig.ChartType.CO2}
                        points={nearestHours.map((hour, index) => {
                            return {
                                x: new Date(hour),
                                y: Number(chartData.co2[index])
                            }
                        })}
                    />
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <ChartView 
                        chartType={ChartConfig.ChartType.NH3}
                        points={nearestHours.map((hour, index) => {
                            return {
                                x: new Date(hour),
                                y: Number(chartData.nh3[index])
                            }
                        })}
                    />
                </div>
            </div>
        </div>
    )
}

export default ListChartView;