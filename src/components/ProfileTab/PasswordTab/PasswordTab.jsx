import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { CustomToastId, LocalStorageKey } from '../../../utils/constant';
import { useState, useEffect } from 'react';
import * as api from '../../../api/api';
import './PasswordTab.scss';

const PasswordTab = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submit, setSubmit] = useState(false)
    const userName = localStorage.getItem(LocalStorageKey.User_Name)

    const handleClickShowPassword = (type) => {
        switch (type) {
            case 'old':
                setShowCurrentPassword(!showCurrentPassword)
                break
            case 'new':
                setShowNewPassword(!showNewPassword)
                break
            case 'confirm':
                setShowConfirmNewPassword(!showConfirmNewPassword)
                break
            default:
                break
        }
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning("Vui lòng nhập đầy đủ các trường thông tin", { toastId: CustomToastId.ChangePasswordTab, autoClose: 1000 })
        } else if (newPassword === currentPassword) {
            toast.warning("Mật khẩu mới không được giống mật khẩu hiện tại", { toastId: CustomToastId.ChangePasswordTab, autoClose: 1000 })
        } else if (confirmPassword !== newPassword) {
            toast.warning("Xác nhận mật khẩu mới chưa chính xác", { toastId: CustomToastId.ChangePasswordTab, autoClose: 1000 })
        } else {
            setSubmit(true)
        }
    }

    useEffect(() => {
        const postData = async () => {
            if(submit) {
                if (toast.isActive(CustomToastId.ChangePasswordTab)) {
                    toast.update(CustomToastId.ChangePasswordTab, { render: "Đang xử lý ...", isLoading: true })
                } else {
                    toast.loading("Đang xử lý ...", { toastId: CustomToastId.ChangePasswordTab })
                }
                
                try {
                    const resultApi = await api.changePassword(userName, currentPassword, newPassword)
                    if (resultApi && resultApi.data && resultApi.data?.code === 0) {
                        toast.update(CustomToastId.ChangePasswordTab, { render: "Đổi mật khẩu thành công", type: "success", isLoading: false, autoClose: 1000 })
                    } else {
                        toast.update(CustomToastId.ChangePasswordTab, { render: resultApi.data?.message || 'Đổi mật khẩu thất bại', type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.ChangePasswordTab, { render: 'Đổi mật khẩu thất bại', type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
            }
        }

        postData()
    }, [submit])

    return (
        <>
            <div className='d-flex flex-column justify-content-center align-items-center mt-4'>
                <FormControl className='mb-3 password-tab-form-control' variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                    <OutlinedInput
                        type={showCurrentPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword('old')}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Mật khẩu cũ"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                </FormControl>
                <FormControl className='mb-3 password-tab-form-control' variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                    <OutlinedInput
                        type={showNewPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword('new')}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                </FormControl>
                <FormControl className='mb-3 password-tab-form-control' variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Xác nhận mật khẩu mới</InputLabel>
                    <OutlinedInput
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleClickShowPassword('confirm')}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </FormControl>
                <Button variant="contained" className='mt-3' onClick={handleSubmit}>Cập nhật</Button>
            </div>
        </>
    )
}

export default PasswordTab;