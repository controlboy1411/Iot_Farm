import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AdminContext } from "../../../../../context/AdminContext";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomToastId } from '../../../../../utils/constant';
import { toast } from 'react-toastify';
import * as api from '../../../../../api/api';
import { validateTextFieldInputNumber } from "../../../../../utils/helper";
import './EditHousePopup.scss';

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

const EditHousePopup = (props) => {
    const { house, setRefreshTable } = props
    const { t } = useTranslation('translation')
    const [houseInfor, setHouseInfor] = useState({
        farmId: 0,
        houseNumber: 0,
        roosterNumber: 0,
        henNumber: 0,
        batchNo: '',
        weekAge: 1,
        status: 0
    })
    const [submit, setSubmit] = useState(false)

    const context = useContext(AdminContext)
    const handleClose = () => context.setEditFarmPopup(false)

    const handleChangeHouseInfor = (property, newValue) => {
        setHouseInfor({...houseInfor, [property]: newValue})
    }

    const handleClickSubmitButton = () => {
        setSubmit(true)
    }

    useEffect(() => {
        setHouseInfor({
            farmId: house.farmId || 0,
            houseNumber: house.houseNumber || 0,
            roosterNumber: house.totalRooster || 0,
            henNumber: house.totalHen || 0,
            batchNo: house.batchNo || null,
            weekAge: house.weekAge || null,
            status: house.status || 0
        })
    }, [house])

    useEffect(() => {
        if (submit) {
            const postData = async function() {
                if (toast.isActive(CustomToastId.EditHouseForm)) {
                    toast.update(CustomToastId.EditHouseForm, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.EditHouseForm })
                }

                try {
                    const resultApi = await api.updateHouse(houseInfor)
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshTable(prev => !prev)
                        toast.update(CustomToastId.EditHouseForm, { render: t('notify.edit_house_success'), type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.EditHouseForm, { render: t('notify.edit_house_fail'), type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.EditHouseForm, { render: t('notify.edit_house_fail'), type: "error", isLoading: false, autoClose: 3000 })
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
                open={context.openEditFarmPopup} onClose={handleClose} 
                aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'
                className='edit-house-popup' disableScrollLock={false}
            >
                <Box sx={modalStyle}>
                    <div className='edit-house-popup-header'>
                        <div className='edit-house-popup-header-title'>{t('popup_title.edit_house_infor')}</div>
                        <IconButton size='medium' onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className='edit-house-popup-body'>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.farm')} value={house.farmName || ''} fullWidth disabled/>
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.house_number')} value={house.houseNumber || ''} fullWidth disabled/>
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.rooster')} placeholder={t('placeholder.rooster')} fullWidth 
                                value={houseInfor.roosterNumber} onKeyDown={validateTextFieldInputNumber} onChange={(event) => handleChangeHouseInfor('roosterNumber', event.target.value)}
                            />
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.hen')} placeholder={t('placeholder.hen')} fullWidth 
                                value={houseInfor.henNumber} onKeyDown={validateTextFieldInputNumber} onChange={(event) => handleChangeHouseInfor('henNumber', event.target.value)}
                            />
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.batch')} placeholder={t('placeholder.batch')} fullWidth 
                                value={houseInfor.batchNo} onChange={(event) => handleChangeHouseInfor('batchNo', event.target.value)}
                            />
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <TextField variant='outlined' label={t('farm_management_table.week')} placeholder={t('placeholder.weekAge')} fullWidth 
                                value={houseInfor.weekAge} onKeyDown={validateTextFieldInputNumber} onChange={(event) => handleChangeHouseInfor('weekAge', event.target.value)}
                            />
                        </div>
                        <div className='edit-house-popup-body-text-field'>
                            <FormControl fullWidth>
                                <InputLabel>{t('dropdown_status')}</InputLabel>
                                <Select label={t('dropdown_status')} value={houseInfor.status} onChange={(event) => handleChangeHouseInfor('status', event.target.value)}>
                                    <MenuItem value={1}>{t('dropdown_status_actived')}</MenuItem>
                                    <MenuItem value={0}>{t('dropdown_status_unactive')}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Button variant="contained" fullWidth className='edit-house-popup-body-confirm-btn' 
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

export default EditHousePopup