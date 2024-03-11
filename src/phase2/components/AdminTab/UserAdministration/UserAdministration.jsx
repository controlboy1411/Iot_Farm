import { Box, Breadcrumbs, Button, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, 
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import WarningIcon from '@mui/icons-material/Warning';
import { formatPhoneNumber, removeVietnameseAccent } from '../../../../utils/helper';
import * as api from '../../../../api/api';
import moment from 'moment';
import { AdminContext } from '../../../../context/AdminContext';
import AddUserPopup from './AddUserPopup/AddUserPopup';
import EditUserPopup from './EditUserPopup/EditUserPopup';
import { Popup } from '../../../../components/shared';
import { toast } from 'react-toastify';
import { CustomToastId } from '../../../../utils/constant';
import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { LANGUAGE_TYPE } from '../../../../i18n/type';
import './UserAdministration.scss';

const UserAdministration = () => {
    const { t } = useTranslation('translation')
    const adminContext = useContext(AdminContext)
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dataRows, setDataRows] = useState({
        loading: false,
        error: false,
        data: []
    })
    const [totalData, setTotalData] = useState(0)
    const [refreshUserTable, setRefreshUserTable] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [userIdEdit, setUserIdEdit] = useState(0)
    const [userIdDelete, setUserIdDelete] = useState(0)

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }

    const handleClickAddUser = () => {
        adminContext.setOpenAddUserPopup(true)
    }

    const handleClickEditUser = (userId) => {
        setUserIdEdit(userId)
        adminContext.setEditUserPopup(true)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleClickDeleteUserBtn = (userId) => {
        setUserIdDelete(userId)
        setShowDeletePopup(true)
    }

    useEffect(() => {
        const fetchMasterDataFarm = async function() {
            const resultApi = await api.getMasterDataFarms()
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setFarms(resultApi.data.data)
                setFarmSelect(resultApi.data.data[0]?.farmId || 0)
            }
        }

        fetchMasterDataFarm()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setDataRows({ loading: true, error: false, data: [] })
            try {
                const resultApi = await api.searchUsersV2(page, rowsPerPage, Number(farmSelect))
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
    }, [farmSelect, refreshUserTable, page, rowsPerPage])

    useEffect(() => {
        if (confirmDelete) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.DeleteUsers)) {
                    toast.update(CustomToastId.DeleteUsers, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.DeleteUsers })
                }

                try {
                    const resultApi = await api.deleteUsers([userIdDelete])
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshUserTable(prev => !prev)
                        toast.update(CustomToastId.DeleteUsers, { render: t('notify.delete_user_success'), type: 'success', isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.DeleteUsers, { render: t('notify.delete_user_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.DeleteUsers, { render: t('notify.delete_user_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                }
                setConfirmDelete(false)
            }
            postData()
        }
    }, [confirmDelete])

    return (
        <div>
            <div className='user-admin-tab-container-0'>
                <div>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Typography color='gray' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_admin')}</Typography>
                        <Typography color='text.primary' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_admin_user')}</Typography>
                    </Breadcrumbs>
                </div>
                <Paper elevation={2}>
                    <div className='user-admin-tab-container-0-1'>
                        <div className='d-flex flex-row row align-items-center'>
                            <div className='col d-flex flex-row align-items-center justify-content-start'>
                                <FormControl fullWidth classes={{root: 'user-admin-tab-container-0-1-form-control-root'}}>
                                    <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                                    <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                                        {farms.map(farm => (
                                            <MenuItem value={farm.farmId}>
                                                {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                            </MenuItem>
                                        ))} 
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='col d-flex justify-content-end'>
                                <Button 
                                    variant='contained' startIcon={<PersonAddIcon fontSize='small' />} 
                                    classes={{root: 'user-admin-tab-container-0-1-btn-root'}}
                                    sx={{ width: '100px', minWidth: '100px', height: '35px', fontSize: '13px' }}
                                    onClick={handleClickAddUser}
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
                                                        <TableCell align='center' className='user-admin-tab-table-header'>{t('user_table.serial')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.user_name')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.full_name')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.role')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.date_of_birth')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.email')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.phone_number')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-header'>{t('user_table.status')}</TableCell>
                                                        <TableCell align='center' className='user-admin-tab-table-header'>{t('user_table.action')}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {dataRows.data.map((row, index) => (
                                                    <TableRow>
                                                        <TableCell align='center' className='user-admin-tab-table-cell'>{index + 1}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>{row.userName}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>
                                                            {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? row.fullName : removeVietnameseAccent(row.fullName)}
                                                        </TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>{row.role}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>{moment(row.dateOfBirth).format('DD-MM-YYYY')}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>{row.email}</TableCell>
                                                        <TableCell align='left' className='user-admin-tab-table-cell'>{formatPhoneNumber(row.phoneNumber)}</TableCell> 
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
                                                                    <IconButton onClick={() => handleClickEditUser(row.userId)}>
                                                                        <ModeEditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={t('tool_tip.delete_user')}>
                                                                    <IconButton onClick={() => handleClickDeleteUserBtn(row.userId)}>
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
            <AddUserPopup setRefreshUserTable={setRefreshUserTable}/>
            <EditUserPopup userId={userIdEdit} setRefreshUserTable={setRefreshUserTable}/>
            <Popup 
                title={t('popup_title.delete_user')}
                open={showDeletePopup}
                setOpen={setShowDeletePopup}
                body={
                    <div>
                        <div className='user-admin-tab-delete-popup-content'>{t('question.confirm_delete_user')}</div>
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

export default UserAdministration;