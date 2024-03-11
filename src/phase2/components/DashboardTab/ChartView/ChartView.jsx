import CanvasJSReact from '../../../../components/shared/ChartBase/canvasjs.react';
import { LineChartConfig } from '../../../../config/app.config';
import { useTranslation } from "react-i18next";
import './ChartView.scss';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartView = (props) => {
    const { chartType, points } = props
    const { t } = useTranslation('translation')

    const options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: t(LineChartConfig[chartType].title),
            fontFamily: 'IBM Plex Sans',
            fontWeight: 600,
            fontSize: 15,
            margin: 15,
            horizontalAlign: 'left'
        },
        axisX: {
            title: `${t(LineChartConfig[chartType].hAxisName)} (${LineChartConfig[chartType].xAxisUnit})`,
            titleFontFamily: 'IBM Plex Sans',
            titleFontWeight: 400,
            titleFontSize: 14,
            gridThickness: 1,
            gridThickness: 1,
            gridColor: "#d4d4d4",
            lineThickness: 1,
            lineColor: "#828282",
            labelWrap: true,
            labelMaxWidth: 40,
            labelAngle: 0,
            labelFontSize: 13,
            labelAutoFit: true,
            interval: 2,    // set distance between 2 values in axis
            viewportMinimum: 0,
            viewportMaximum: 23,
        },
        axisY: {
            title: `${t(LineChartConfig[chartType].vAxisName)} (${LineChartConfig[chartType].yAxisUnit})`,
            titleFontFamily: 'IBM Plex Sans',
            titleFontWeight: 400,
            titleFontSize: 15,
            gridThickness: 1,
            gridColor: "#d4d4d4",
            lineThickness: 1,
            lineColor: "#828282",
            labelAngle: 0,
            labelFontSize: 13,
            labelFontFamily: 'IBM Plex Sans',
            tickLength: 0,
            maximum: LineChartConfig[chartType].extraValueY + Math.max(...points.map(point => point.y)),
            minimum: 0
        },
        toolTip: {
			cornerRadius: 4,
            fontSize: 13,
            fontFamily: 'IBM Plex Sans',
            contentFormatter: function (e) {
				var content = ''
				for (var i = 0; i < e.entries.length; i++) {
					content += `<strong>${t('chart.tool_tip_time')}</strong>: ` + `0${e.entries[i].dataPoint.x}:00`.slice(-5) + '<hr/>'
					content += '<strong>' + t(LineChartConfig[chartType].vAxisName) + '</strong>: ' + e.entries[i].dataPoint.y + t(LineChartConfig[chartType].yAxisUnit)
				}
				return content;
			}
		},
        data: [{
            type: "splineArea", 
            cursor: "pointer",  
            lineColor: "#00964C",   // set line color
            color: "#E8F6F0",   // set area color
            markerColor: "#00964C", // set point color
            indexLabelFontColor: '#127020', // set color for data point in area
            indexLabelFontFamily: 'IBM Plex Sans',  // set font family for data point in area
            dataPoints: points
        }]
    }
    return (
        <div className='chart-view-container'>
            <CanvasJSChart options = {options} />
            <div className='chart-view-unlock-trial'></div>
        </div>
    )
}

export default ChartView;