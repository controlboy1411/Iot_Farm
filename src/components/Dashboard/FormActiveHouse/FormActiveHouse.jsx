import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import * as api from '../../../api/api';
import './FormActiveHouse.scss';

const FormActiveHouse = (props) => {
    const { farmId, houseId, showForm, setShowForm } = props
    const [valueForm, setValueForm] = useState({roostersNum: 0, hensNum: 0, chickenBatch: 0, weekNo: 0})
    const [valueCheck, setValueCheck] = useState({roostersNum: true, hensNum: true, chickenBatch: true, weekNo: true})
    const [agree, setAgree] = useState(false)
    const [checkValid, setCheckValid] = useState(true)
    const [submit, setSubmitForm] = useState(false)
    const [showFormResult, setShowFormResult] = useState({status: false, message: ''})

    const handleChangeValueForm = (value, property) => {
        switch (property) {
            case 'roostersNum': 
                setValueForm({...valueForm, roostersNum: value})
                if (value !== '' && !isNaN(Number(value))) {
                    setValueCheck({...valueCheck, roostersNum: true})
                }
                break
            case 'hensNum': 
                setValueForm({...valueForm, hensNum: value})
                if (value !== '' && !isNaN(Number(value))) {
                    setValueCheck({...valueCheck, hensNum: true})
                }
                break
            case 'chickenBatch': 
                setValueForm({...valueForm, chickenBatch: value})
                if (value !== '' && !isNaN(Number(value))) {
                    setValueCheck({...valueCheck, chickenBatch: true})
                }
                break
            case 'weekNo': 
                setValueForm({...valueForm, weekNo: value})
                if (value !== '' && !isNaN(Number(value))) {
                    setValueCheck({...valueCheck, weekNo: true})
                }
                break
            default:
                break
        }
    }

    const handleClickCheckBox = (event) => {
        if (!checkValid) {
            setCheckValid(event.target.checked)
        }
        setAgree(event.target.checked)
    }

    const handleSubmitForm = () => {
        setCheckValid(agree)
        Object.keys(valueForm).map(key => {
            if (valueForm[key] === '' || isNaN(Number(valueForm[key]))) {
                let newValueCheck = valueCheck
                newValueCheck[key] = false
                setValueCheck(newValueCheck)
            }
        })
        if (agree) {
            setSubmitForm(!submit)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const updateResult = await api.activeHouse(Number(farmId), Number(houseId), Number(valueForm.roostersNum), Number(valueForm.hensNum), Number(valueForm.chickenBatch), Number(valueForm.weekNo))
            if (updateResult && updateResult.data && updateResult.data?.code === 0) {
                setShowForm(false)
                setShowFormResult({status: true, message: 'Kích hoạt chuồng thành công!'})
            } else {
                setShowForm(false)
                setShowFormResult({status: true, message: 'Đã có lỗi xảy ra, kích hoạt thất bại!'})
            }
        }

        if (agree) {
            fetchData()
        }
    }, [submit])

    return (
        <>
            <Modal show={showForm} animation onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>Kích hoạt chuồng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Chuồng số</Form.Label>
                            <Form.Control type="text" placeholder={`${houseId}`} disabled readOnly/>
                        </Form.Group>                        
                        <Form.Group className="mb-3">
                            <Form.Label>Số gà trống</Form.Label>
                            <Form.Control type="text" defaultValue={0} isInvalid={!valueCheck.roostersNum} onChange={(event) => handleChangeValueForm(event.target.value, 'roostersNum')}/>
                            <Form.Control.Feedback type="invalid">Giá trị không hợp lệ</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số gà mái</Form.Label>
                            <Form.Control type="text" defaultValue={0} isInvalid={!valueCheck.hensNum} onChange={(event) => handleChangeValueForm(event.target.value, 'hensNum')}/>
                            <Form.Control.Feedback type="invalid">Giá trị không hợp lệ</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Lứa nuôi thứ</Form.Label>
                            <Form.Control type="text" defaultValue={0} isInvalid={!valueCheck.chickenBatch} onChange={(event) => handleChangeValueForm(event.target.value, 'chickenBatch')}/>
                            <Form.Control.Feedback type="invalid">Giá trị không hợp lệ</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tuần tuổi thứ</Form.Label>
                            <Form.Control type="text" defaultValue={0} isInvalid={!valueCheck.weekNo} onChange={(event) => handleChangeValueForm(event.target.value, 'weekNo')}/>
                            <Form.Control.Feedback type="invalid">Giá trị không hợp lệ</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{alignItems: 'normal', flexDirection: 'column'}}>
                    <FormCheck>
                        <FormCheck.Input 
                            type='checkbox' 
                            className='form-agree-checkbox' 
                            required 
                            isInvalid={!checkValid}
                            defaultChecked={false}
                            onClick={handleClickCheckBox}
                        />
                        <FormCheck.Label>Bạn có đồng ý kích hoạt không?</FormCheck.Label>
                        <Form.Control.Feedback type="invalid">Vui lòng xác nhận kích hoạt</Form.Control.Feedback>
                    </FormCheck>
                    <div className='d-flex flex-row justify-content-end'>
                        <Button variant="danger" className='form-button' onClick={() => setShowForm(false)}>Hủy</Button>
                        <span className='form-button-space'/>
                        <Button variant="warning" className='form-button' onClick={handleSubmitForm}>Kích hoạt</Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal show={showFormResult.status} animation onHide={() => setShowFormResult({status: false, message: ''})}>
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showFormResult.message}</Modal.Body>
            </Modal>
        </>
    )
}

export default FormActiveHouse;