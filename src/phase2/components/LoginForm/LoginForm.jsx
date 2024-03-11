import Modal from 'react-bootstrap/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState, useContext } from 'react';
import { useQueryParams, useSetQueryParams } from '../../../hook';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { CustomToastId, LocalStorageKey } from '../../../utils/constant';
import { ROUTE_PATH } from '../../../config/routes.config';
import * as api from '../../../api/api';
import jwtDecode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../context/AppContext';
import './LoginForm.scss';

const LoginForm = () => {
    const appContext = useContext(AppContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showWarningUsername, setShowWarningUsername] = useState(false)
    const [showWarningPassword, setShowWarningPassword] = useState(false)
    const [submit, setSubmit] = useState(false)
    const { t } = useTranslation('translation')

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleChangeUsername = (event) => {
        setUsername(event.target.value)
        if (event.target.value) {
            setShowWarningUsername(false)
        }
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
        if (event.target.value) {
            setShowWarningPassword(false)
        }
    }

    const handlePressEnter = (event) => {
        if (event.code === 'Enter') {
            handleLoginBtn()
        }
    }

    const handleLoginBtn = () => {
        if (!username) {
            setShowWarningUsername(true)
        }

        if (!password) {
            setShowWarningPassword(true)
        }

        if (username && password) {
            setSubmit(true)
        }
    }

    const queryParams = useQueryParams()
    const setQueryParams = useSetQueryParams()

    useEffect(() => {
        if (submit) {
            const fetchData = async () => {
                if (toast.isActive(CustomToastId.LoginForm)) {
                    toast.update(CustomToastId.LoginForm, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.LoginForm })
                }

                try {
                    const resultApi = await api.login({username, password})
                    if (resultApi && resultApi.data) {
                        if (resultApi.data.code != 0) {
                            toast.update(CustomToastId.LoginForm, { render: resultApi.data.message, type: "error", isLoading: false, autoClose: 3000 })
                        } else {
                            toast.update(CustomToastId.LoginForm, { render: t('notify.login_success'), type: "success", isLoading: false, autoClose: 3000 })
                            appContext.setIsLogin(true)
                            const accessToken = resultApi.data.data.accessToken
                            const decodedToken = jwtDecode(accessToken)
                            localStorage.setItem(LocalStorageKey.User_Id, decodedToken?.userId)
                            localStorage.setItem(LocalStorageKey.User_Role, decodedToken?.userRole)
                            localStorage.setItem(LocalStorageKey.User_Name, decodedToken?.userName)
                            localStorage.setItem(LocalStorageKey.Full_Name, decodedToken?.fullName)

                            const farmIds = decodedToken?.farmIds?.split(',') || []
                            if (farmIds.length > 0) {
                                setQueryParams(ROUTE_PATH.HOME, queryParams)
                            } else {
                                toast.update(CustomToastId.LoginForm, { render: t('notify.login_fail'), type: "error", isLoading: false, autoClose: 3000 })
                            }
                        }
                    } else {
                        toast.update(CustomToastId.LoginForm, { render: t('notify.login_fail'), type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.LoginForm, { render: t('notify.login_fail'), type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
            }

            fetchData()
        }
    }, [submit])

    return (
        <div>
            <Modal show={true} centered>
                <Modal.Body as='div'>
                    <div className='login-form-container'>
                        <div className='login-form-title'>{t('popup_title.login')}</div>
                        <div className='login-form-text-field'>
                            <TextField className='mui-text-field-custom' variant="outlined" label={t('user_table.user_name')} fullWidth
                                value={username} onChange={handleChangeUsername} onKeyDown={handlePressEnter}
                            />
                            {showWarningUsername && (
                                <div className='login-form-text-field-warning'>{t('notify.username_not_empty')}</div>
                            )}
                        </div>
                        <div className='login-form-text-field'>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">{t('user_table.password')}</InputLabel>
                                <OutlinedInput type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('user_table.password')}
                                    sx={{fontFamily: 'IBM Plex Sans'}}
                                    value={password}
                                    onChange={handleChangePassword}
                                    onKeyDown={handlePressEnter}                          
                                />
                            </FormControl>
                            {showWarningPassword && (
                                <div className='login-form-text-field-warning'>{t('notify.password_not_empty')}</div>
                            )}
                        </div>
                        <Button variant="contained" fullWidth className='login-form-login-btn' onClick={handleLoginBtn}>{t('button.login')}</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default LoginForm;