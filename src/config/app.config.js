export const ChartConfig = {
    NumberMinutes: 1440,
    DistanceMinutes: 60,
    ChartType: {
        Temp: 'Temp',
        Humi: 'Humi',
        CO2: 'CO2',
        NH3: 'NH3'
    }
}

export const LineChartConfig = {
    Temp: {
        title: 'temp_chart_title',
        hAxisName: 'temp_chart_hAxisName',
        vAxisName: 'temp_chart_vAxisName',
        toolTipContent: '{x}<br/><hr/>Nhiệt độ: {y} (\u00B0C)',
        toolTipTitle: 'Nhiệt độ',
        xAxisUnit: 'h',
        yAxisUnit: '\u00B0C',
        vAxisTicks: [0, 10, 20, 30, 40, 50],
        extraValueY: 10,
    },
    Humi: {
        title: 'humi_chart_title',
        hAxisName: 'humi_chart_hAxisName',
        vAxisName: 'humi_chart_vAxisName',
        toolTipTitle: 'Độ ẩm',
        xAxisUnit: 'h',
        yAxisUnit: '%',
        vAxisTicks: [0, 20, 40, 60, 80, 100],
        extraValueY: 20,
    },
    CO2: {
        title: 'co2_chart_title',
        hAxisName: 'co2_chart_hAxisName',
        vAxisName: 'co2_chart_vAxisName',
        toolTipTitle: 'CO2',
        xAxisUnit: 'h',
        yAxisUnit: '%',
        vAxisTicks: [0, 0.01, 0.02, 0.03, 0.04, 0.05],
        extraValueY: 0.01
    },
    NH3: {
        title: 'nh3_chart_title',
        hAxisName: 'nh3_chart_hAxisName',
        vAxisName: 'nh3_chart_vAxisName',
        toolTipTitle: 'NH3',
        xAxisUnit: 'h',
        yAxisUnit: '%',
        vAxisTicks: [0, 0.01, 0.02, 0.03, 0.04, 0.05],
        extraValueY: 0.01
    }
}

export const DefaultPassword = 'Hanoi@123'

export const QueryParamKey = {
    FarmId: 'farm_id',
    HouseId: 'house_id'
}