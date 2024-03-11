import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import * as api from '../../../../../api/api.js';
import dayjs from 'dayjs';
import './SummaryTable.scss';

const rowDesc = {
    maxValue: 'summary_table.max_value',
    maxValueTime: 'summary_table.max_value_time',
    minValue: 'summary_table.min_value',
    minValueTime: 'summary_table.min_value_time',
    avgValue: 'summary_table.avg_value',
    numOfOverRange: 'summary_table.num_of_over_range'
}

const SummaryTable = (props) => {
    const { farmId, houseId, fromDate, toDate } = props
    const [dataRows, setDataRows] = useState([])
    const { t } = useTranslation("translation")

    useEffect(() => {
        const fetchData = async function() {
            const _fromDate = dayjs(fromDate).format('YYYY-MM-DD')
            const _toDate = dayjs(toDate).format('YYYY-MM-DD')

            const resultApi = await api.getSummaryDataReport(houseId, _fromDate, _toDate)
            if (resultApi && resultApi.data && resultApi.data.data) {
                setDataRows(resultApi.data.data)
            }
        }

        fetchData()
    }, [houseId, fromDate, toDate])

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' className='output-report-summary-table-header' sx={{width: '200px'}}></TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('temperature')} (&deg;C)</TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('humidity')} (%)</TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('concentration_co2')} (%)</TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('concentration_nh3')} (%)</TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('wind_speed')} (ft/min)</TableCell>
                            <TableCell align='center' className='output-report-summary-table-header'>{t('light')} (Lux)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataRows.map((row) => (
                        <TableRow>
                            <TableCell align='left'>{t(rowDesc[row.desc])}</TableCell>
                            <TableCell align='center'>{row.temp}</TableCell>
                            <TableCell align='center'>{row.humi}</TableCell>
                            <TableCell align='center'>{row.co2}</TableCell>
                            <TableCell align='center'>{row.nh3}</TableCell>
                            <TableCell align='center'>{row.windSpeed}</TableCell>
                            <TableCell align='center'>{row.lightIntensity}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default SummaryTable;