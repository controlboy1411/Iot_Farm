import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import { CustomToastId, FarmId, RoleId, farmNames, farms, listFarms, listRoles, roles } from '../../../../../utils/constant';
import { formatDate_DDMMYYYY_to_YYYYMMDD } from '../../../../../utils/helper';
import { useState, useEffect } from 'react';
import * as api from '../../../../../api/api';
import './EditUserTab.scss';

const EditUserTab = (props) => {
    const { user, setShowFormUpdate, updateSuccess, setUpdateSuccess } = props
    const [confirmEdit, setConfirmEdit] = useState(false)
    const [userInfor, setUserInfor] = useState({
        ...user, 
        farmId: null, 
        roleId: null,
        dateOfBirth: dayjs(formatDate_DDMMYYYY_to_YYYYMMDD(user.dateOfBirth))
    })

    const handleSelectFarm = (event) => {
        const farmSelected = event.target.value
        if (farmSelected === farmNames[farms[FarmId.All]]) {
            if (userInfor.role === roles[RoleId.IT] || userInfor.role === roles[RoleId.Manager]) {
                setUserInfor({...userInfor, farm: farmSelected, farmId: FarmId.All})
            }
        } else {
            setUserInfor({...userInfor, farm: farmSelected, farmId: FarmId[Object.keys(farmNames).find(key => farmNames[key] === farmSelected)]})
        }
    }

    const handleSelectRole = (event) => {
        setUserInfor({...userInfor, role: event.target.value, roleId: RoleId[event.target.value]})
    }

    const handleClickCancelButton = () => {
        setShowFormUpdate(false)
    }

    const handleClickConfirmButton = () => {
        setConfirmEdit(true)
    }

    useEffect(() => {
        if (confirmEdit) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.UpdateInformation)) {
                    toast.update(CustomToastId.UpdateInformation, { render: "Đang cập nhật thông tin người dùng ...", isLoading: true })
                } else {
                    toast.loading("Đang cập nhật thông tin người dùng ...", { toastId: CustomToastId.UpdateInformation })
                }

                try {
                    const resultApi = await api.updateUserInfor({
                        User_Id: userInfor.userId,
                        Full_Name: userInfor.name,
                        Address: userInfor.address,
                        Date_Of_Birth: userInfor.dateOfBirth,
                        Phone_Number: userInfor.phone,
                        Email: userInfor.email,
                        Farm_Id: userInfor.farmId,
                        Role_Id: userInfor.roleId
                    })
    
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thành công", type: "success", isLoading: false, autoClose: 2000 })
                        setShowFormUpdate(false)
                        setUpdateSuccess(!updateSuccess)
                    } else {
                        toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thất bại", type: "error", isLoading: false, autoClose: 1000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thất bại", type: "error", isLoading: false, autoClose: 1000 })
                }
            }

            postData()
            setConfirmEdit(false)
        }
    }, [confirmEdit])

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stack direction='column'>
                    <Stack direction='row' spacing={2} marginTop={2}>
                        <TextField
                            label="Họ tên" variant="outlined" className='edit-user-tab-text-field' 
                            defaultValue={user.name} onChange={(event) => setUserInfor({...userInfor, name: event.target.value})}
                        />
                        <TextField 
                            label="Email" variant="outlined" className='edit-user-tab-text-field' 
                            defaultValue={user.email} onChange={(event) => setUserInfor({...userInfor, email: event.target.value})}
                        />
                    </Stack>
                    <Stack direction={window.innerWidth > 500 ? 'row' : 'column'} spacing={2} marginTop={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{paddingTop: 1}}>
                                <DemoItem>
                                    <DatePicker
                                        label='Ngày sinh' format='DD-MM-YYYY' defaultValue={userInfor.dateOfBirth}
                                        onChange={newValue => setUserInfor({...userInfor, dateOfBirth: newValue})}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <TextField 
                            label="SĐT" variant="outlined"
                            fullWidth={window.innerWidth > 500 ? false : true}
                            className={window.innerWidth > 500 ? 'mt-2' : 'mt-4'}
                            defaultValue={user.phone} onChange={(event) => setUserInfor({...userInfor, phone: event.target.value})}
                        />
                    </Stack>
                    <Stack direction='row' spacing={2} marginTop={3}>
                        <TextField 
                            label="Địa chỉ" variant="outlined" fullWidth 
                            defaultValue={user.address} onChange={(event) => setUserInfor({...userInfor, address: event.target.value})}
                        />
                    </Stack>
                    <Stack direction='row' spacing={2} marginTop={3}>
                        <FormControl fullWidth>
                            <InputLabel>Farm</InputLabel>
                            <Select 
                                label="Farm" 
                                value={(userInfor.role === roles[RoleId.IT] || userInfor.role === roles[RoleId.Manager]) ? farmNames[farms[FarmId.All]] : userInfor.farm} 
                                onChange={handleSelectFarm}
                            >
                                {listFarms.map((farm) => {
                                    return <MenuItem value={farm.farmName}>{farm.farmName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select 
                                label="Role" 
                                value={userInfor.role} 
                                onChange={handleSelectRole}
                            >
                                {listRoles.map((role) => {
                                    return <MenuItem value={role.roleName}>{role.roleName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Divider className='mt-4' sx={{ backgroundColor: '#4e4e4e'}}/>
                    <Stack direction='row' justifyContent='center' spacing={2}>
                        <Button variant="contained" color='primary' className='mt-3 edit-user-tab-btn' onClick={handleClickCancelButton}>Hủy</Button>
                        <Button variant="contained" color='success' className='mt-3 edit-user-tab-btn' onClick={handleClickConfirmButton}>Xác nhận</Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default EditUserTab;