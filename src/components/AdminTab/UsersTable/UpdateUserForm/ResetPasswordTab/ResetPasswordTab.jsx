import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { DefaultPassword } from '../../../../../config/app.config';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CustomToastId } from '../../../../../utils/constant';
import * as api from '../../../../../api/api';
import './ResetPasswordTab.scss';


const ResetPasswordTab = (props) => {
    const { user, setShowFormUpdate } = props
    const [confirmReset, setConfirmReset] = useState(false)
    const [newPassword, setNewPassword] = useState(DefaultPassword)
    
    const handleClickCancelButton = () => {
        setShowFormUpdate(false)
    }

    const handleClickConfirmButton = () => {
        setConfirmReset(true)
    }

    useEffect(() => {
        if (confirmReset) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.ResetPasswordTab)) {
                    toast.update(CustomToastId.ResetPasswordTab, { render: "Đang xử lý ...", isLoading: true })
                } else {
                    toast.loading("Đang xử lý ...", { toastId: CustomToastId.ResetPasswordTab })
                }

                try {
                    const resultApi = await api.resetPassword(user?.userId || 0, newPassword)
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        toast.update(CustomToastId.ResetPasswordTab, { render: "Reset mật khẩu thành công", type: "success", isLoading: false, autoClose: 1000 })
                    } else {
                        toast.update(CustomToastId.ResetPasswordTab, { render: "Reset mật khẩu thất bại", type: "error", isLoading: false, autoClose: 1000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.ResetPasswordTab, { render: "Reset mật khẩu thất bại", type: "error", isLoading: false, autoClose: 1000 })
                }
            }

            postData()
            setConfirmReset(false)
        }
    }, [confirmReset])

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stack direction='column'>
                    <Stack direction='column' spacing={2}>
                        <Typography variant='inherit'>Reset mật khẩu của user <strong>{user?.name || ''}</strong> về mật khẩu:</Typography>
                        <TextField label="Mật khẩu mới" variant="outlined" defaultValue={DefaultPassword} className='reset-password-text-field' onChange={(event) => setNewPassword(event.target.value)}/>
                    </Stack>
                    <Divider className='mt-4' sx={{ backgroundColor: '#4e4e4e'}}/>
                    <Stack direction='row' justifyContent='center' spacing={2}>
                        <Button variant="contained" color='primary' className='mt-3 reset-password-btn' onClick={handleClickCancelButton}>Hủy</Button>
                        <Button variant="contained" color='success' className='mt-3 reset-password-btn' onClick={handleClickConfirmButton}>Xác nhận</Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default ResetPasswordTab;