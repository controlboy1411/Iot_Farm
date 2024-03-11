import CanvasJSReact from "./Lib/canvasjs.react";
import { LineChartConfig } from '../../../config/app.config';
import moment from 'moment';
import './ChartView.scss';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartView = (props) => {
    const { chartType, points } = props

    const options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: LineChartConfig[chartType].title,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            margin: 20
        },
        axisX: {
            title: LineChartConfig[chartType].hAxisName,
            titleFontFamily: 'Roboto, Helvetica, Arial, sans-serif',
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
            labelFontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            labelFormatter: function (e) {
				return CanvasJS.formatDate(e.value, "HH:mm")
			},
        },
        axisY: {
            title: LineChartConfig[chartType].vAxisName,
            titleFontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            titleFontWeight: 400,
            titleFontSize: 15,
            gridThickness: 1,
            gridColor: "#d4d4d4",
            lineThickness: 1,
            lineColor: "#828282",
            labelAngle: 0,
            labelFontSize: 13,
            labelFontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        },
        toolTip: {
			cornerRadius: 4,
            fontSize: 13,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            contentFormatter: function (e) {
				var content = ''
				for (var i = 0; i < e.entries.length; i++) {
					content += moment(e.entries[i].dataPoint.x).format('YYYY-MM-DD HH:mm:ss') + '<hr/>'
					content += '<strong>' + LineChartConfig[chartType].toolTipTitle + '</strong>: ' + e.entries[i].dataPoint.y + LineChartConfig[chartType].unit
				}
				return content;
			}
		},
        data: [{
            type: "spline",
            cursor: "pointer",
            dataPoints: points
        }]
    }
    return (
        <CanvasJSChart options = {options} />
    )
}

export default ChartView;