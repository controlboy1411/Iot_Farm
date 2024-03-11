import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import * as api from '../../../api/api';
import { toast } from 'react-toastify';
import { CustomToastId, LocalStorageKey } from "../../../utils/constant";
import { useState, useEffect } from 'react';
import moment from 'moment';
import './InformationTab.scss';

const InformationTab = () => {
    const userId = localStorage.getItem(LocalStorageKey.User_Id)
    const [userInfor, setUserInfor] = useState({})
    const [editValue, setEditValue] = useState({Full_Name: false, Address: false, Date_Of_Birth: false, Phone_Number: false})
    const [updateValue, setUpdateValue] = useState({Full_Name: '', Address: '', Date_Of_Birth: '', Phone_Number: ''})
    const [submit, setSubmit] = useState(false)

    const handleClickEdit = (property) => {
        setEditValue({...editValue, [property]: true})
        setUpdateValue({...updateValue, [property]: userInfor[property]})
    }

    const handleUpdateValue = (property, value) => {
        setUpdateValue({...updateValue, [property]: value})
    }

    const handleClickSubmit = () => {
        setSubmit(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (submit) {
                if (toast.isActive(CustomToastId.UpdateInformation)) {
                    toast.update(CustomToastId.UpdateInformation, { render: "Đang cập nhật thông tin người dùng ...", isLoading: true })
                } else {
                    toast.loading("Đang cập nhật thông tin người dùng ...", { toastId: CustomToastId.UpdateInformation })
                }

                const updateData = {...updateValue, User_Id: userId}
                try {
                    const resultApi = await api.updateUserInfor(updateData)
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thành công", type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thất bại", type: "error", isLoading: false, autoClose: 1000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.UpdateInformation, { render: "Cập nhật thất bại", type: "error", isLoading: false, autoClose: 1000 })
                }

                // After update user infor
                setSubmit(false)
                setEditValue({Full_Name: false, Address: false, Date_Of_Birth: false, Phone_Number: false})
            }

            if (toast.isActive(CustomToastId.InformationTab)) {
                toast.update(CustomToastId.InformationTab, { render: "Đang tải dữ liệu ...", isLoading: true })
            } else {
                toast.loading("Đang tải dữ liệu ...", { toastId: CustomToastId.InformationTab })
            }

            try {
                const resultApi = await api.getUserInfor(userId)
                if (resultApi && resultApi.data && resultApi.data.data) {
                    setUserInfor(resultApi.data.data)
                    toast.update(CustomToastId.InformationTab, { render: "Tải dữ liệu thành công", type: "success", isLoading: false, autoClose: 2000 })
                } else {
                    toast.update(CustomToastId.InformationTab, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 1000 })
                }
            } catch (e) {
                toast.update(CustomToastId.InformationTab, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 1000 })
            }
        }

        fetchData()
    }, [userId, submit])

    return (
        <>
            <div className='d-flex flex-column align-items-center mt-3'>
                <div className='d-flex flex-row row row-cols-1 row-cols-lg-2 align-items-center w-100 mb-3'>
                    <div className='col d-flex justify-content-center'>
                        <Avatar src="/broken-image.jpg" className='mb-3 information-tab-ava'/>
                    </div>
                    <div className='col d-flex flex-column align-items-center'>
                        <TextField id="outlined-basic" label="Họ tên" variant="outlined" className='mb-3 information-tab-text-field' defaultValue='Họ tên'
                            disabled={!editValue.Full_Name} value={editValue.Full_Name ? updateValue.Full_Name : userInfor?.Full_Name} 
                            onChange={(event) => handleUpdateValue('Full_Name', event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton aria-label="toggle password visibility" edge="end" onClick={() => handleClickEdit('Full_Name')}>
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField id="outlined-basic" label='Địa chỉ' variant="outlined" className={`mb-${editValue.Date_Of_Birth ? 2 : 3} information-tab-text-field`} defaultValue='Địa chỉ' 
                            disabled={!editValue.Address} value={editValue.Address ? updateValue.Address : userInfor?.Address}
                            onChange={(event) => handleUpdateValue('Address', event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton aria-label="toggle password visibility" edge="end" onClick={() => handleClickEdit('Address')}>
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {editValue.Date_Of_Birth ? 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} >
                                <DemoItem>
                                    <DatePicker label='Ngày sinh' format='DD-MM-YYYY' className='information-tab-date-picker'
                                        value={dayjs(moment(userInfor?.Date_Of_Birth).format('YYYY-MM-DD'))}
                                        onChange={newValue =>  handleUpdateValue('Date_Of_Birth', dayjs(newValue).format('YYYY-MM-DD'))}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider> :
                        <TextField id="outlined-basic" label='Ngày sinh' variant="outlined" className='mb-2 information-tab-text-field' defaultValue='Ngày sinh' 
                            disabled value={moment(userInfor?.Date_Of_Birth).format('DD-MM-YYYY')}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton aria-label="toggle password visibility" edge="end" onClick={() => handleClickEdit('Date_Of_Birth')}>
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        }
                    </div>
                </div>
                <div className='d-flex flex-row row row-cols-1 row-cols-lg-2 w-100'>
                    <div className='col d-flex justify-content-center'>
                        <TextField id="outlined-basic" label="Email" variant="outlined" disabled className='mb-3 information-tab-text-field' defaultValue='Email' value={userInfor?.Email}/>
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <TextField id="outlined-basic" label="SĐT" variant="outlined" className='mb-3 information-tab-text-field' defaultValue='SĐT' 
                            disabled={!editValue.Phone_Number} value={editValue.Phone_Number ? updateValue.Phone_Number : userInfor?.Phone_Number}
                            onChange={(event) => handleUpdateValue('Phone_Number', event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton aria-label="toggle password visibility" edge="end" onClick={() => handleClickEdit('Phone_Number')}>
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <TextField id="outlined-basic" label="Farm" variant="outlined" disabled className='mb-3 information-tab-text-field' defaultValue='Farm' value={userInfor?.Farm}/>
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <TextField id="outlined-basic" label="Vai trò" variant="outlined" disabled className='mb-3 information-tab-text-field' defaultValue='Vai trò' value={userInfor?.Role_Name}/>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center mt-3'>
                    <Button variant="contained" onClick={handleClickSubmit}>Cập nhật</Button>
                </div>
            </div>
        </>
    )
}

export default InformationTab;