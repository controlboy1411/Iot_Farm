import { useEffect, useState } from "react";
import LineChart from "./LineChart.jsx";
import * as api from "../../../api/api";
import { getNearestHours } from "../../../utils/helper";
import { ChartConfig, LineChartConfig } from '../../../config/app.config.js';
import moment from "moment";
import _ from 'lodash'

const ListLineChart = (props) => {
    const { houseId } = props
    const FAKE_DATA_FLAG = false
    const getLineChartOptions = (chartType, hAxisMinValue) => {
        return {
            title: LineChartConfig[chartType]['title'] || "",
            hAxis: { title: LineChartConfig[chartType]['hAxisName'], minValue: moment(hAxisMinValue).toDate(), format: 'HH:mm\ndd/MM' },
            vAxis: { title: LineChartConfig[chartType]['vAxisName'], minValue: LineChartConfig[chartType]['vAxisTicks'][0], ticks: LineChartConfig[chartType]['vAxisTicks'] },
        }
    }

    const getFakeData = (chartType) => {
        if (chartType == ChartConfig.ChartType.Temp) {
            return _.random(22, 24)
        } else if (chartType == ChartConfig.ChartType.Humi) {
            return _.random(76, 80)
        } else if (chartType == ChartConfig.ChartType.NH3) {
            return _.random(0.01, 0.015)
        } else {
            return _.random(0.025, 0.03)
        }
    }

    const getLineChartData = (chartType, nearestHours, data, isFake = false) => {
        let lineData = [['Time', chartType]]
        if (isFake) {
            nearestHours?.map((hour) => {
                lineData.push([moment(hour).toDate(), getFakeData(chartType)])
            })
        } else {
            if (data && Array.isArray(data)) {
                nearestHours?.map((hour, index) => {
                    lineData.push([moment(hour).toDate(), Number(data[index])])
                })
            } else {
                nearestHours?.map(hour => {
                    lineData.push([moment(hour).toDate(), 0])
                })
            }
        }

        return lineData
    }

    const initNearestHours = getNearestHours(ChartConfig.NumberMinutes, ChartConfig.DistanceMinutes)
    const [tempChartInfor, setTempChartInfor] = useState({
        data: getLineChartData(ChartConfig.ChartType.Temp, initNearestHours),
        chartOption: getLineChartOptions(ChartConfig.ChartType.Temp, initNearestHours[0])
    })
    const [humiChartInfor, setHumiChartInfor] = useState({
        data: getLineChartData(ChartConfig.ChartType.Humi, initNearestHours),
        chartOption: getLineChartOptions(ChartConfig.ChartType.Humi, initNearestHours[0])
    })
    const [co2ChartInfor, setCo2ChartInfor] = useState({
        data: getLineChartData(ChartConfig.ChartType.CO2, initNearestHours),
        chartOption: getLineChartOptions(ChartConfig.ChartType.CO2, initNearestHours[0])
    })
    const [nh3ChartInfor, setNh3ChartInfor] = useState({
        data: getLineChartData(ChartConfig.ChartType.NH3, initNearestHours),
        chartOption: getLineChartOptions(ChartConfig.ChartType.NH3, initNearestHours[0])
    })

    useEffect(() => {
        const fetchData = async () => {
            const nearestHours = getNearestHours(ChartConfig.NumberMinutes, ChartConfig.DistanceMinutes)
            const lineChartData = await api.getLineChartData(houseId, nearestHours, ChartConfig.DistanceMinutes)
            const lineChartResult = lineChartData.data?.data
            setTempChartInfor({
                data: getLineChartData(ChartConfig.ChartType.Temp, nearestHours, lineChartResult?.temp || null, FAKE_DATA_FLAG),
                chartOption: getLineChartOptions(ChartConfig.ChartType.Temp, nearestHours[0])
            })
            setHumiChartInfor({
                data: getLineChartData(ChartConfig.ChartType.Humi, nearestHours, lineChartResult?.humi || null, FAKE_DATA_FLAG),
                chartOption: getLineChartOptions(ChartConfig.ChartType.Humi, nearestHours[0])
            })
            setCo2ChartInfor({
                data: getLineChartData(ChartConfig.ChartType.CO2, nearestHours, lineChartResult?.co2 || null, FAKE_DATA_FLAG),
                chartOption: getLineChartOptions(ChartConfig.ChartType.CO2, nearestHours[0])
            })
            setNh3ChartInfor({
                data: getLineChartData(ChartConfig.ChartType.NH3, nearestHours, lineChartResult?.nh3 || null, FAKE_DATA_FLAG),
                chartOption: getLineChartOptions(ChartConfig.ChartType.NH3, nearestHours[0])
            })
        };

        fetchData();
    }, [houseId])

    return (
        <div className="mb-4">
            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                <div className="col"><LineChart data={tempChartInfor.data} chartOptions={tempChartInfor.chartOption} /></div>
                <div className="col"><LineChart data={humiChartInfor.data} chartOptions={humiChartInfor.chartOption} /></div>
                <div className="col"><LineChart data={co2ChartInfor.data} chartOptions={co2ChartInfor.chartOption} /></div>
                <div className="col"><LineChart data={nh3ChartInfor.data} chartOptions={nh3ChartInfor.chartOption} /></div>
            </div>
        </div>
    )
}

export default ListLineChart;