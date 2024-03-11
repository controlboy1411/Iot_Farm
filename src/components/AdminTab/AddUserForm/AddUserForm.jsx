import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import moment from 'moment';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import * as api from '../../../api/api';
import { toast } from 'react-toastify';
import { CustomToastId, RoleId, listFarms, listRoles } from '../../../utils/constant';
import { DefaultPassword } from '../../../config/app.config';
import './AddUserForm.scss';


const AddUserForm = (props) => {
    const { showForm, setShowForm, addUser, setAddUser } = props
    const [valueForm, setValueForm] = useState({farm: {id: 0, name: ''}, role: {id: 0, name: ''}, fullName: '', dateOfBirth: dayjs(moment().format('YYYY-MM-DD')), email: '', phone: '', address: ''})
    const [submit, setSubmitForm] = useState(false)

    const handleChangeValueForm = (value, property) => {
        setValueForm({...valueForm, [property]: value})
    }

    const handleSubmitForm = () => {
        setSubmitForm(true)
    }

    useEffect(() => {
        const postData = async () => {
            if (submit) {
                if (toast.isActive(CustomToastId.AddUserForm)) {
                    toast.update(CustomToastId.AddUserForm, { render: "Đang xử lý ...", isLoading: true })
                } else {
                    toast.loading("Đang xử lý ...", { toastId: CustomToastId.AddUserForm })
                }
    
                try {
                    const resultApi = await api.register(valueForm)
                    if (resultApi && resultApi.data && resultApi.data.code == 0) {
                        setShowForm(false)
                        setAddUser(!addUser)
                        toast.update(CustomToastId.AddUserForm, { render: "Tạo mới user thành công", type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.AddUserForm, { render: "Tạo user thất bại", type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.AddUserForm, { render: "Tạo user thất bại", type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmitForm(false)
            }
        }

        postData()
    }, [submit])

    return (
        <>
            <Modal show={showForm} animation onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>Thêm user mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Stack direction="horizontal" gap={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Chọn Farm</Form.Label>
                                <Stack direction="horizontal" gap={0}>
                                    <Form.Control type="text" readOnly bsPrefix='form-control add-user-form-input-bar' value={(valueForm.role.id == RoleId.IT || valueForm.role.id == RoleId.Manager) ? 'Tất cả Farm' : valueForm.farm.name}/>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic" bsPrefix='dropdown-toggle add-user-form-dropdown-btn'/>
                                        <Dropdown.Menu>
                                            {listFarms.map(farm => {
                                                return farm.farmId !== 0 && (
                                                    <Dropdown.Item onClick={() => setValueForm({...valueForm, farm: {id: farm.farmId, name: farm.farmName}})}>{farm.farmName}</Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Stack>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Vai trò</Form.Label>
                                <Stack direction="horizontal" gap={0}>
                                    <Form.Control type="text" readOnly bsPrefix='form-control add-user-form-input-bar' value={valueForm.role.name}/>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic" bsPrefix='dropdown-toggle add-user-form-dropdown-btn'/>
                                        <Dropdown.Menu>
                                            {listRoles.map(role => {
                                                return (
                                                    <Dropdown.Item onClick={() => setValueForm({...valueForm, role: {id: role.roleId, name: role.roleName}})}>{role.roleName}</Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Stack>
                            </Form.Group>
                        </Stack>
                        <Stack direction="horizontal" gap={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control type="text" bsPrefix='form-control add-user-form-input-bar-2' onChange={(event) => handleChangeValueForm(event.target.value, 'fullName')}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Ngày sinh</Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{paddingTop: 0}}>
                                        <DemoItem>
                                            <DatePicker format='DD-MM-YYYY' value={valueForm.dateOfBirth} onChange={newValue => handleChangeValueForm(newValue, 'dateOfBirth')} className='add-user-form-date-picker'/>
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Form.Group>
                        </Stack>
                        <Stack direction="horizontal" gap={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" placeholder='' onChange={(event) => handleChangeValueForm(event.target.value, 'email')}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>SĐT</Form.Label>
                                <Form.Control type="text" placeholder='' onChange={(event) => handleChangeValueForm(event.target.value, 'phone')}/>
                            </Form.Group>
                        </Stack>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control type="text" placeholder='' onChange={(event) => handleChangeValueForm(event.target.value, 'address')}/>
                        </Form.Group>
                        <Stack direction="horizontal" gap={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Tên đăng nhập</Form.Label>
                                <Form.Control type="text" placeholder={valueForm.email} disabled readOnly/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mật khẩu mặc định</Form.Label>
                                <Form.Control type="text" placeholder={DefaultPassword} disabled readOnly/>
                            </Form.Group>
                        </Stack>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{alignItems: 'normal', flexDirection: 'column'}}>
                    <div className='d-flex flex-row justify-content-end'>
                        <Button variant="danger" className='add-user-form-button' onClick={() => setShowForm(false)}>Hủy</Button>
                        <span className='add-user-form-button-space'/>
                        <Button variant="warning" className='add-user-form-button' onClick={handleSubmitForm}>Thêm user</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddUserForm;