import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Checkbox, IconButton, ListItemText, RadioGroup, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputAdornment, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomTabPanel } from '../../../../../components/shared';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../../../../context/AdminContext';
import dayjs from 'dayjs';
import moment from 'moment';
import * as api from '../../../../../api/api';
import { DefaultPassword } from '../../../../../config/app.config';
import { CustomToastId, listRoles, listFarms2 } from '../../../../../utils/constant';
import { toast } from 'react-toastify'; 
import i18n from 'i18next';
import { LANGUAGE_TYPE } from '../../../../../i18n/type';
import { useTranslation } from "react-i18next";
import { removeVietnameseAccent } from '../../../../../utils/helper';
import './EditUserPopup.scss';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translate(-100%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderWidth: 0,
    boxShadow: 24,
    height: '100vh',
};

const TabIndex = {
    EditUserTab: 0,
    ResetPasswordTab: 1
}

const EditUserPopup = (props) => {
    const { t } = useTranslation("translation")
    const { userId, setRefreshUserTable } = props
    const [tabIndexValue, setTabValue] = useState(TabIndex.EditUserTab)
    const [submitEditBtn, setSubmitEditBtn] = useState(false)
    const [userInfor, setUserInfor] = useState({
        userId: userId,
        farmIds: [],
        roleId: '',
        status: '',
        fullName: '',
        dateOfBirth: moment().format('YYYY-MM-DD'),
        gender: '',
        email: '',
        phoneNumber: '',
        address: ''
    })

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [warningResetPassword, setWarningResetPassword] = useState('')
    const [submitResetBtn, setSubmitResetBtn] = useState(false)

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

    const context = useContext(AdminContext)
    const handleClose = () => context.setEditUserPopup(false)

    const handleChangeUserInfor = (paramName, value) => {
        if (paramName === 'farmIds') {
            if (value.indexOf(0) > -1) {
                setUserInfor(prev => ({...prev, farmIds: listFarms2.map(farm => farm.farmId)}))
            } else {
                setUserInfor(prev => ({...prev, farmIds: value}))
            }
        } else {
            setUserInfor(prev => ({...prev, [paramName]: value}))
        }
    }

    const handleClickCheckAllFarm = (checked) => {
        if (!checked) {
            setUserInfor(prev => ({...prev, farmIds: []}))
        }
    }

    const handleClickSubmitEditButton = () => {
        setSubmitEditBtn(true)
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleClickSubmitResetButton = () => {
        setSubmitResetBtn(true)
    }

    const submitResetPasswordValid = function() {
        if (!password || !confirmPassword) {
            setWarningResetPassword(t('notify.required_field_warning'))
            return false
        }

        if (password !== confirmPassword) {
            setWarningResetPassword(t('notify.compare_password_warning'))
            return false
        }

        return true
    }

    // Load data user
    useEffect(() => {
        const fetchDataInit = async function() {
            const resultApi = await api.getUserInforV2(userId)
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setUserInfor(resultApi.data.data)
            }
        }

        fetchDataInit()
    }, [userId])

    // Submit edit user infor
    useEffect(() => {
        if (submitEditBtn) {
            const postDataEdit = async function() {
                if (toast.isActive(CustomToastId.UpdateInformation)) {
                    toast.update(CustomToastId.UpdateInformation, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.UpdateInformation })
                }
    
                try {
                    const resultApi = await api.updateUserInforV2(userInfor)
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshUserTable(prev => !prev)
                        toast.update(CustomToastId.UpdateInformation, { render: t('notify.edit_user_success'), type: 'success', isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.UpdateInformation, { render: t('notify.edit_user_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                    }
                } catch(err) {
                    toast.update(CustomToastId.UpdateInformation, { render: err.response.data.message || t('notify.edit_user_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                }

                setSubmitEditBtn(false)
            }
    
            postDataEdit()
        }
    }, [submitEditBtn])

    // Submit reset password
    useEffect(() => {
        if (submitResetBtn) {
            if (submitResetPasswordValid()) {
                const postDataReset = async function() {
                    if (toast.isActive(CustomToastId.ResetPasswordTab)) {
                        toast.update(CustomToastId.ResetPasswordTab, { render: t('notify.processing'), isLoading: true })
                    } else {
                        toast.loading(t('notify.processing'), { toastId: CustomToastId.ResetPasswordTab })
                    }
        
                    try {
                        const resultApi = await api.resetPassword(userId, password)
                        if (resultApi && resultApi.data && resultApi.data.code === 0) {
                            toast.update(CustomToastId.ResetPasswordTab, { render: t('notify.reset_password_success'), type: 'success', isLoading: false, autoClose: 2000 })
                        } else {
                            toast.update(CustomToastId.ResetPasswordTab, { render: t('notify.reset_password_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                        }
                    } catch(err) {
                        toast.update(CustomToastId.ResetPasswordTab, { render: err.response.data.message || t('notify.reset_password_fail'), type: 'error', isLoading: false, autoClose: 3000 })
                    }
                }

                postDataReset()
            }

            setSubmitResetBtn(false)
        }
    }, [submitResetBtn])

    return (
        <div>
            <Modal 
                open={context.openEditUserPopup} onClose={handleClose} 
                aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'
                className='edit-user-popup' disableScrollLock={false}
            >
                <Box sx={modalStyle}>
                    <Box>
                        <div className='edit-user-popup-header'>
                            <Tabs value={tabIndexValue} onChange={handleChangeTab} classes={{indicator: 'edit-user-popup-tabs-indicator'}}>
                                <Tab 
                                    label={t('popup_title.update_user')}
                                    classes={{root: tabIndexValue === TabIndex.EditUserTab ? 'edit-user-popup-tab-root-selected' : ''}} 
                                    sx={{textTransform: 'none', fontSize: '15px', fontWeight: '600'}}
                                />
                                <Tab 
                                    label={t('popup_title.reset_password')}
                                    classes={{root: tabIndexValue === TabIndex.ResetPasswordTab ? 'edit-user-popup-tab-root-selected' : ''}} 
                                    sx={{textTransform: 'none', fontSize: '15px', fontWeight: '600'}}
                                />
                            </Tabs>
                            <IconButton size='medium' onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </Box>
                    <CustomTabPanel value={tabIndexValue} index={TabIndex.EditUserTab}>
                        <div className='edit-user-popup-body'>
                            <div className='edit-user-popup-body-text-field'>
                                <FormControl fullWidth>
                                    <InputLabel>Farm</InputLabel>
                                    <Select
                                        multiple
                                        input={<OutlinedInput label='Farm' />}
                                        value={userInfor.farmIds} 
                                        renderValue={(selected) => {
                                            if (userInfor.farmIds.length === listFarms2.length) {
                                                return i18n.language === LANGUAGE_TYPE.VIETNAMESE ? 'Tất cả Farm' : 'All Farm'
                                            }
                                            return removeVietnameseAccent(listFarms2.filter(farm => selected.indexOf(farm.farmId) > -1).map(farm => farm.farmName).join(', '))
                                        }}
                                        onChange={(event) => handleChangeUserInfor('farmIds', event.target.value)}
                                    >
                                        <MenuItem key={0} value={0}>
                                            <Checkbox checked={userInfor.farmIds.length === listFarms2.length} onChange={(event) =>handleClickCheckAllFarm(event.target.checked)}/>
                                            <ListItemText primary={i18n.language === LANGUAGE_TYPE.VIETNAMESE ? 'Tất cả Farm' : 'All Farm'} />
                                        </MenuItem>
                                        {listFarms2.map(farm => (
                                            <MenuItem key={farm.farmId} value={farm.farmId}>
                                                <Checkbox checked={userInfor.farmIds.indexOf(farm.farmId) > -1} />
                                                <ListItemText primary={i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <FormControl fullWidth>
                                    <InputLabel>{t('user_table.role')}</InputLabel>
                                    <Select label={t('user_table.role')} value={userInfor.roleId} onChange={(event) => handleChangeUserInfor('roleId', event.target.value)}>
                                        {listRoles.map(role => (
                                            <MenuItem value={role.roleId}>{role.roleName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <FormControl fullWidth>
                                    <InputLabel>{t('dropdown_status')}</InputLabel>
                                    <Select label={t('dropdown_status')} value={userInfor.status} onChange={(event) => handleChangeUserInfor('status', event.target.value)}>
                                        <MenuItem value='1'>{t('dropdown_status_actived')}</MenuItem>
                                        <MenuItem value='0'>{t('dropdown_status_unactive')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <TextField variant="outlined" label={`${t('user_table.full_name')} (*)`} placeholder={t('placeholder.fullname')} fullWidth 
                                    value={userInfor.fullName} onChange={(event) => handleChangeUserInfor('fullName', event.target.value)}
                                />
                            </div>
                            <div className='d-flex flex-row edit-user-popup-body-text-field'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} >
                                        <DemoItem>
                                            <DatePicker label={t('user_table.date_of_birth')} format='DD-MM-YYYY' className='edit-user-popup-date-picker'
                                                value={dayjs(userInfor.dateOfBirth)}
                                                onChange={(value) => handleChangeUserInfor('dateOfBirth', dayjs(value).format('YYYY-MM-DD'))}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <RadioGroup row value={userInfor.gender} onChange={(event) => handleChangeUserInfor('gender', event.target.value)}
                                >
                                    <FormControlLabel control={<Radio />} labelPlacement='start' label={t('user_table.gender_male')} value='male' classes={{root: 'edit-user-popup-form-control-label-root'}}/>
                                    <FormControlLabel control={<Radio />} labelPlacement='start' label={t('user_table.gender_female')} value='female' classes={{root: 'edit-user-popup-form-control-label-root'}}/>
                                </RadioGroup>
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <TextField variant="outlined" label='Email (*)' placeholder={t('placeholder.email')} fullWidth 
                                    value={userInfor.email} onChange={(event) => handleChangeUserInfor('email', event.target.value)}
                                />
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <TextField variant="outlined" label={`${t('user_table.phone_number')} (*)`} placeholder={t('placeholder.phone')} fullWidth 
                                    value={userInfor.phoneNumber} onChange={(event) => handleChangeUserInfor('phoneNumber', event.target.value)}
                                />
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <TextField variant="outlined" label={`${t('user_table.address')} (*)`} placeholder={t('placeholder.address')} fullWidth 
                                    value={userInfor.address} onChange={(event) => handleChangeUserInfor('address', event.target.value)}
                                />
                            </div>
                            <Button variant='contained' fullWidth className='edit-user-popup-body-confirm-btn' 
                                onClick={handleClickSubmitEditButton}
                            >
                                {t('button.confirm_title')}
                            </Button>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndexValue} index={TabIndex.ResetPasswordTab}>
                        <div className='edit-user-popup-body'>
                            <div className='edit-user-popup-body-text-field'>
                                <FormControl variant='outlined' fullWidth>
                                    <InputLabel htmlFor='outlined-adornment-password'>{t('placeholder.new_password')} (*)</InputLabel>
                                    <OutlinedInput type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge='end'
                                                >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label={`${t('placeholder.new_password')} (*)`}
                                        sx={{fontFamily: 'IBM Plex Sans'}}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}                                
                                    />
                                </FormControl>
                            </div>
                            <div className='edit-user-popup-body-text-field'>
                                <FormControl variant='outlined' fullWidth>
                                    <InputLabel htmlFor='outlined-adornment-password'>{t('placeholder.confirm_new_password')} (*)</InputLabel>
                                    <OutlinedInput type={showPasswordConfirm ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={handleClickShowPasswordConfirm}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge='end'
                                                >
                                                {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label={`${t('placeholder.confirm_new_password')} (*)`}
                                        sx={{fontFamily: 'IBM Plex Sans'}}
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}                                
                                    />
                                </FormControl>
                            </div>
                            <Typography sx={{fontSize: '14px', color: 'red', fontWeight: '400', display: warningResetPassword ? 'inline' : 'none'}}>
                                {warningResetPassword}
                            </Typography>
                            <Button variant='contained' fullWidth className='edit-user-popup-body-confirm-btn' 
                                onClick={handleClickSubmitResetButton}
                            >
                                {t('button.confirm_title')}
                            </Button>
                        </div>
                    </CustomTabPanel>
                    
                </Box>
            </Modal>
        </div>
    )
};

export default EditUserPopup;