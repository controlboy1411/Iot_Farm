import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../../../api/api.js';
import dayjs from 'dayjs';
import './DetailTable.scss';


const DetailTable = (props) => {
    const { farmId, houseId, fromDate, toDate } = props
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [totalData, setTotalData] = useState(0)
    const [dataRows, setDataRows] = useState([])

    const { t } = useTranslation("translation")

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    useEffect(() => {
        const fetchData = async () => {
            const _fromDate = dayjs(fromDate).format('YYYY-MM-DD')
            const _toDate = dayjs(toDate).format('YYYY-MM-DD')
            const resultApi = await api.getDataTable(houseId, page + 1, rowsPerPage, _fromDate, _toDate)
            if (resultApi && resultApi.data && resultApi.data.data) {
                setDataRows(resultApi.data.data.data)
                setTotalData(resultApi.data.data.count)
            }
        }

        fetchData()
    }, [houseId, fromDate, toDate, page, rowsPerPage])

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' className='output-report-detail-table-header' sx={{width: '80px'}}>{t('serial')}</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('temperature')} (&deg;C)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('humidity')} (%)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>CO2 (%)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>NH3 (%)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('fan')}</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('wind_speed')} (ft/min)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('lamp')}</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('light')} (Lux)</TableCell>
                            <TableCell align='center' className='output-report-detail-table-header'>{t('date_and_time')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataRows.map((row, index) => (
                        <TableRow>
                            <TableCell align='center'>{index + 1}</TableCell>
                            <TableCell align='center'>{row?.Temperature ? Number(row?.Temperature).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.Humidity ? Number(row?.Humidity).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.CO2 ? Number(row?.CO2).toFixed(3) : "0.000"}</TableCell>
                            <TableCell align='center'>{row?.NH3 ? Number(row?.NH3).toFixed(3) : "0.000"}</TableCell>
                            <TableCell align='center'>{row?.Wind_Status ? Number(row?.Wind_Speed) > 0 ? "On" : "Off" : ""}</TableCell>
                            <TableCell align='center'>{row?.Wind_Speed ? (Number(row?.Wind_Speed) * 196.85).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.Light_Status ? Number(row?.Light_Intensity) > 0 ? "On" : "Off" : ""}</TableCell>
                            <TableCell align='center'>{row?.Light_Intensity ? Number(row?.Light_Intensity).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.Measurement_Time?.toString()?.replace('T', ' ')?.replace('Z', ' ')?.slice(0, -5) || ""}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                labelRowsPerPage={`${t('records_per_page')}:`}
                labelDisplayedRows={({ from, to, count }) => { return `${from}-${to} ${t('of')} ${count}`}}
                component='div'
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default DetailTable;