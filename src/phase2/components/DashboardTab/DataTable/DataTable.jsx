import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import * as api from '../../../../api/api';
import './DataTable.scss';

const DataTable = (props) => {
    const { houseId, dateSelect } = props
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
            try {
                const dataDashboard = await api.getDataTable(houseId, page + 1, rowsPerPage, dayjs(dateSelect).format('YYYY-MM-DD'), dayjs(dateSelect).format('YYYY-MM-DD'))
                setDataRows(dataDashboard.data.data.data)
                setTotalData(dataDashboard.data.data.count)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchData()
    }, [houseId, dateSelect, page, rowsPerPage])

    return (
        <React.Fragment>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' className='dashboard-tab-data-table-header' sx={{width: '80px'}}>{t('serial')}</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('temperature')} (&deg;C)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('humidity')} (%)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>CO2 (%)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>NH3 (%)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('wind_speed')} (ft/min)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('fan')} (On/Off)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('light')} (Lux)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('lamp')} (On/Off)</TableCell>
                            <TableCell align='center' className='dashboard-tab-data-table-header'>{t('date_and_time')}</TableCell>
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
                            <TableCell align='center'>{row?.Wind_Speed ? (Number(row?.Wind_Speed) * 196.85).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.Wind_Status ? Number(row?.Wind_Speed) > 0 ? "On" : "Off" : ""}</TableCell>
                            <TableCell align='center'>{row?.Light_Intensity ? Number(row?.Light_Intensity).toFixed(2) : "0.00"}</TableCell>
                            <TableCell align='center'>{row?.Light_Status ? Number(row?.Light_Intensity) > 0 ? "On" : "Off" : ""}</TableCell>
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
        </React.Fragment>
    )
}

export default DataTable