import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Checkbox, IconButton, ListItemText, RadioGroup } from '@mui/material';
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
import './AddUserPopup.scss'

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

const AddUserPopup = (props) => {
    const { t } = useTranslation("translation")
    const { setRefreshUserTable } = props
    const [showPassword, setShowPassword] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [userInfor, setUserInfor] = useState({
        username: '',
        password: DefaultPassword,
        farmIds: [],
        roleId: '',
        status: '',
        fullName: '',
        dateOfBirth: moment().format('YYYY-MM-DD'),
        gender: 'male',
        email: '',
        phoneNumber: '',
        address: ''
    })

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

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

    const context = useContext(AdminContext)
    const handleClose = () => context.setOpenAddUserPopup(false)

    const handleClickSubmitButton = () => {
        setSubmit(true)
    }
    
    useEffect(() => {
        if (submit) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.AddUserForm)) {
                    toast.update(CustomToastId.AddUserForm, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.AddUserForm })
                }

                try {
                    const resultApi = await api.registerV2(userInfor)
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshUserTable(prev => !prev)
                        toast.update(CustomToastId.AddUserForm, { render: t('notify.create_user_success'), type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.AddUserForm, { render: t('notify.create_user_fail'), type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.AddUserForm, { render: t('notify.create_user_fail'), type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
                handleClose()
            }
            postData()
        }
    }, [submit])

    return (
        <div>
            <Modal 
                open={context.openAddUserPopup} onClose={handleClose} 
                aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'
                className='add-new-user-popup' disableScrollLock={false}
            >
                <Box sx={modalStyle}>
                    <div className='add-new-user-popup-header'>
                        <div className='add-new-user-popup-header-title'>{t('popup_title.add_user')}</div>
                        <IconButton size='medium' onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className='add-new-user-popup-body'>
                        <div className='add-new-user-popup-body-text-field'>
                            <TextField variant="outlined" label={`${t('user_table.user_name')} (*)`} placeholder={t('placeholder.username')} fullWidth 
                                value={userInfor.username} onChange={(event) => handleChangeUserInfor('username', event.target.value)}
                            />
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <FormControl variant='outlined' fullWidth>
                                <InputLabel htmlFor='outlined-adornment-password'>{t('user_table.password')} (*)</InputLabel>
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
                                    label={`${t('user_table.password')} (*)`}
                                    sx={{fontFamily: 'IBM Plex Sans'}}
                                    value={userInfor.password}
                                    onChange={(event) => handleChangeUserInfor('password', event.target.value)}                                
                                />
                            </FormControl>
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
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
                                        <ListItemText primary={i18n.language === LANGUAGE_TYPE.VIETNAMESE ? 'Tất cả Farm' : 'All Farm'}/>
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
                        <div className='add-new-user-popup-body-text-field'>
                            <FormControl fullWidth>
                                <InputLabel>{t('user_table.role')}</InputLabel>
                                <Select label={t('user_table.role')} value={userInfor.roleId} onChange={(event) => handleChangeUserInfor('roleId', event.target.value)}>
                                    {listRoles.map(role => (
                                        <MenuItem value={role.roleId}>{role.roleName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <FormControl fullWidth>
                                <InputLabel>{t('dropdown_status')}</InputLabel>
                                <Select label={t('dropdown_status')} value={userInfor.status} onChange={(event) => handleChangeUserInfor('status', event.target.value)}>
                                    <MenuItem value='1'>{t('dropdown_status_actived')}</MenuItem>
                                    <MenuItem value='0'>{t('dropdown_status_unactive')}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <TextField variant="outlined" label={`${t('user_table.full_name')} (*)`} placeholder={t('placeholder.fullname')} fullWidth 
                                value={userInfor.fullName} onChange={(event) => handleChangeUserInfor('fullName', event.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-row add-new-user-popup-body-text-field'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} >
                                    <DemoItem>
                                        <DatePicker label={t('user_table.date_of_birth')} format='DD-MM-YYYY' className='add-user-popup-date-picker'
                                            value={dayjs(userInfor.dateOfBirth)}
                                            onChange={(value) => handleChangeUserInfor('dateOfBirth', dayjs(value).format('YYYY-MM-DD'))}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                            <RadioGroup row value={userInfor.gender} onChange={(event) => handleChangeUserInfor('gender', event.target.value)}
                            >
                                <FormControlLabel control={<Radio />} labelPlacement='start' label={t('user_table.gender_male')} value='male' classes={{root: 'add-new-user-popup-form-control-label-root'}}/>
                                <FormControlLabel control={<Radio />} labelPlacement='start' label={t('user_table.gender_female')} value='female' classes={{root: 'add-new-user-popup-form-control-label-root'}}/>
                            </RadioGroup>
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <TextField variant="outlined" label='Email (*)' placeholder={t('placeholder.email')} fullWidth 
                                value={userInfor.email} onChange={(event) => handleChangeUserInfor('email', event.target.value)}
                            />
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <TextField variant="outlined" label={`${t('user_table.phone_number')} (*)`} placeholder={t('placeholder.phone')} fullWidth 
                                value={userInfor.phoneNumber} onChange={(event) => handleChangeUserInfor('phoneNumber', event.target.value)}
                            />
                        </div>
                        <div className='add-new-user-popup-body-text-field'>
                            <TextField variant="outlined" label={`${t('user_table.address')} (*)`} placeholder={t('placeholder.address')} fullWidth 
                                value={userInfor.address} onChange={(event) => handleChangeUserInfor('address', event.target.value)}
                            />
                        </div>
                        <Button variant="contained" fullWidth className='add-new-user-popup-body-confirm-btn' 
                            onClick={handleClickSubmitButton}
                        >
                            {t('button.confirm_title')}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AddUserPopup