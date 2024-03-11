import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import * as api from '../../../../api/api';
import { toast } from 'react-toastify';
import { CustomToastId } from '../../../../utils/constant';
import './DeleteUserForm.scss';

const DeleteUserForm = (props) => {
    const { showFormDelete, setShowFormDelete, setDisplayDeleteButton, deleteSuccess, setDeleteSuccess, userIds } = props
    const [deleteSubmit, setDeleteSubmit] = useState(false)

    const handleSubmitClick = () => {
        setDeleteSubmit(true)
        setShowFormDelete(false)
        setDisplayDeleteButton('none')
    }

    const handleCancelClick = () => {
        setDeleteSubmit(false)
        setShowFormDelete(false)
    }

    useEffect(() => {
        const postData = async () => {
            if (toast.isActive(CustomToastId.DeleteUsers)) {
                toast.update(CustomToastId.DeleteUsers, { render: "Đang xử lý ...", isLoading: true })
            } else {
                toast.loading("Đang xử lý ...", { toastId: CustomToastId.DeleteUsers })
            }

            try {
                const resultApi = await api.deleteUsers(userIds)
                if (resultApi && resultApi.data && resultApi.data.code === 0) {
                    toast.update(CustomToastId.DeleteUsers, { render: `Xóa thành công ${userIds.length} user`, type: "success", isLoading: false, autoClose: 2000 })
                    setDeleteSuccess(!deleteSuccess)
                } else {
                    toast.update(CustomToastId.DeleteUsers, { render: "Xóa thất bại", type: "error", isLoading: false, autoClose: 1000 })
                }
            } catch (e) {
                toast.update(CustomToastId.DeleteUsers, { render: "Xóa thất bại", type: "error", isLoading: false, autoClose: 1000 })
            }
        }

        if (deleteSubmit) {
            postData()
        }
    }, [deleteSubmit])

    return (
        <>
            <Modal show={showFormDelete} animation onHide={() => setShowFormDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Typography variant='inherit'>Bạn có đồng ý xóa user không?</Typography>
                    <Stack direction='row' spacing={2} marginTop={2} marginBottom={1} justifyContent='flex-end'>
                        <Button variant="danger" className='delete-user-form-button' onClick={handleCancelClick}>Hủy</Button>
                        <Button variant="warning" className='delete-user-form-button' onClick={handleSubmitClick}>Đồng ý</Button>
                    </Stack>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DeleteUserForm;