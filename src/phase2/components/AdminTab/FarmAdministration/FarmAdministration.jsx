import { Box, Breadcrumbs, Button, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, 
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import WarningIcon from '@mui/icons-material/Warning';
import { AdminContext } from '../../../../context/AdminContext';
import AddHousePopup from './AddHousePopup/AddHousePopup';
import EditHousePopup from './EditHousePopup/EditHousePopup';
import { Popup } from '../../../../components/shared';
import { toast } from 'react-toastify';
import { CustomToastId } from '../../../../utils/constant';
import * as api from '../../../../api/api';
import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { LANGUAGE_TYPE } from '../../../../i18n/type';
import { removeVietnameseAccent } from '../../../../utils/helper';
import './FarmAdministration.scss';

const FarmAdministration = () => {
    const { t } = useTranslation("translation")
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [farmNameSelect, setFarmNameSelect] = useState('')
    const [houseStatusSelect, setHouseStatusSelect] = useState(2)
    const [houseEdit, setHouseEdit] = useState({})

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dataRows, setDataRows] = useState({
        loading: false,
        error: false,
        data: []
    })
    const [totalData, setTotalData] = useState(0)
    const [refreshTable, setRefreshTable] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [houseNumberDelete, setHouseNumberDelete] = useState(0)

    const handleChangeFarmSelect = (event) => {
        let farmId = event.target.value
        let farm = farms.find(farm => farm.farmId == farmId)
        setFarmSelect(farmId)
        setFarmNameSelect(farm.farmName || '')
    }

    const handleChangeHouseStatus = (event) => {
        setHouseStatusSelect(event.target.value)
    }

    const adminContext = useContext(AdminContext)
    const handleClickAddHouse = () => {
        adminContext.setOpenAddFarmPopup(true)
    }

    const handleClickEditHouse = (house) => {
        setHouseEdit(house)
        adminContext.setEditFarmPopup(true)
    }

    const handleClickDeleteHouse = (houseNumber) => {
        setHouseNumberDelete(houseNumber)
        setShowDeletePopup(true)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    useEffect(() => {
        const fetchMasterDataFarm = async function() {
            const resultApi = await api.getMasterDataFarms()
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setFarms(resultApi.data.data)
                setFarmSelect(resultApi.data.data[0]?.farmId || 0)
                setFarmNameSelect(resultApi.data.data[0]?.farmName || '')
            }
        }

        fetchMasterDataFarm()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setDataRows({ loading: true, error: false, data: [] })
            try {
                const resultApi = await api.searchHouses(page, rowsPerPage, Number(farmSelect), Number(houseStatusSelect))
                if (resultApi && resultApi.data && resultApi.data?.code === 0) {
                    setDataRows({ loading: false, error: false, data: resultApi.data.data.data })
                    setTotalData(resultApi.data.data.total || 0)
                } else {
                    setDataRows({ loading: false, error: true, data: [] })
                }
            } catch (err) {
                setDataRows({ loading: false, error: true, data: [] })
            }
        }

        fetchData()
    }, [farmSelect, houseStatusSelect, page, rowsPerPage, refreshTable])

    useEffect(() => {
        if (confirmDelete) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.DeleteFarm)) {
                    toast.update(CustomToastId.DeleteFarm, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.DeleteFarm })
                }

                try {
                    const resultApi = await api.deleteHouse({farmId: farmSelect, houseNumber: houseNumberDelete})
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshTable(prev => !prev)
                        toast.update(CustomToastId.DeleteFarm, { render: t('notify.delete_house_success'), type: 'success', isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.DeleteFarm, { render: t('notify.delete_house_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.DeleteFarm, { render: t('notify.delete_house_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                }
                setConfirmDelete(false)
                setShowDeletePopup(false)
            }
            postData()
        }
    }, [confirmDelete])

    return (
        <div>
            <div className='farm-admin-tab-container-0'>
                <div>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Typography color='gray' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_admin')}</Typography>
                        <Typography color='text.primary' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_admin_farm')}</Typography>
                    </Breadcrumbs>
                </div>
                <Paper elevation={2}>
                    <div className='farm-admin-tab-container-0-1'>
                        <div className='d-flex flex-row row align-items-center'>
                            <div className='col-10 d-flex flex-row justify-content-start align-items-center'>
                                <FormControl fullWidth classes={{root: 'farm-admin-tab-container-0-1-form-control-root'}}>
                                    <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                                    <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                                        {farms.map(farm => (
                                            <MenuItem value={farm.farmId}>
                                                {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                            </MenuItem>
                                        ))} 
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth classes={{root: 'farm-admin-tab-container-0-1-form-control-root'}} sx={{marginLeft: 2}}>
                                    <InputLabel>{t('dropdown_status')}</InputLabel>
                                    <Select value={houseStatusSelect} label='Trạng thái' onChange={handleChangeHouseStatus}>
                                        <MenuItem value={2}>{t('dropdown_status_all')}</MenuItem>
                                        <MenuItem value={1}>{t('dropdown_status_actived')}</MenuItem>
                                        <MenuItem value={0}>{t('dropdown_status_unactive')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='col-2 d-flex justify-content-end'>
                                <Button 
                                    variant='contained' startIcon={<PersonAddIcon fontSize='small' />} 
                                    classes={{root: 'farm-admin-tab-container-0-1-btn-root'}}
                                    sx={{ width: '120px', minWidth: '100px', height: '35px', fontSize: '13px' }}
                                    onClick={handleClickAddHouse}
                                >
                                    {t('button.add_new_title')}
                                </Button>
                            </div>
                        </div>
                        <div className='mt-4'>
                        {dataRows.loading ? (
                            <Stack direction='column' alignItems='center' spacing={1}>
                                <Typography sx={{fontSize: '15px', fontWeight: '600'}}>{t('loading_data')}</Typography>
                                <Box width='180px'>
                                    <LinearProgress />
                                </Box>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {dataRows.error ? 
                                    <Stack direction='row' spacing={1} alignItems='flex-end' justifyContent='center' marginTop={2}>
                                        <WarningIcon color='error'/>
                                        <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#3c3c3c'}}>{t('notify.can_not_load_data')}</Typography>
                                    </Stack> :
                                    <Box>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.serial')}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.farm')}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.house')}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.rooster')}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.hen')}</TableCell>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.batch')}</TableCell>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.week')}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.status')}</TableCell>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-header'>{t('farm_management_table.action')}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {dataRows.data.map((row, index) => (
                                                    <TableRow>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-body'>{index + 1}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-body'>
                                                            {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? row.farmName : removeVietnameseAccent(row.farmName)}
                                                        </TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-body'>
                                                            {`${t('dropdown_house_label')} ${row.houseNumber}`}
                                                        </TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-body'>{row.totalRooster}</TableCell>
                                                        <TableCell align='left' className='farm-admin-tab-table-cell-body'>{row.totalHen}</TableCell>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-body'>{row.batchNo}</TableCell>
                                                        <TableCell align='center' className='farm-admin-tab-table-cell-body'>{row.weekAge}</TableCell> 
                                                        <TableCell align='left'>
                                                            <Stack direction='row'>
                                                                <CircleIcon sx={{width: '8px', color: row.status === 1 ? '#46c41d' : '#c40502', marginRight: '10px'}}/>
                                                                <Typography sx={{fontSize: '14px'}}>
                                                                    {row.status === 1 ? t('dropdown_status_actived') : t('dropdown_status_unactive')}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell> 
                                                        <TableCell align='center'>
                                                            <Stack direction='row' justifyContent='center'>
                                                                <Tooltip title={t('tool_tip.change_information')}>
                                                                    <IconButton onClick={() => handleClickEditHouse(row)}>
                                                                        <ModeEditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={t('tool_tip.delete_house')}>
                                                                    <IconButton onClick={() => handleClickDeleteHouse(row.houseNumber)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 20, 50]}
                                            component='div'
                                            labelRowsPerPage={`${t('records_per_page')}:`}
                                            labelDisplayedRows={({ from, to, count }) => { return `${from}-${to} ${t('of')} ${count}`}}
                                            count={totalData}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Box>
                                }
                            </React.Fragment>
                        )}
                        </div>
                    </div>
                </Paper>
            </div>
            <AddHousePopup farmId={farmSelect} farmName={farmNameSelect} houseNumber={Number(totalData) + 1} setRefreshTable={setRefreshTable}/>
            <EditHousePopup house={houseEdit} setRefreshTable={setRefreshTable}/>
            <Popup 
                title={t('popup_title.delete_house')}
                open={showDeletePopup}
                setOpen={setShowDeletePopup}
                body={
                    <div>
                        <div className='user-admin-tab-delete-popup-content'>{t('question.confirm_delete_house')}</div>
                        <div className='d-flex flex-row justify-content-end'>
                            <Button variant='contained' fullWidth className='user-admin-tab-delete-popup-confirm-btn' onClick={() => setConfirmDelete(true)}>{t('button.agree_title')}</Button> 
                            <Button variant='contained' fullWidth className='user-admin-tab-delete-popup-cancel-btn' onClick={() => setShowDeletePopup(false)}>{t('button.cancel_title')}</Button>                 
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export default FarmAdministration;