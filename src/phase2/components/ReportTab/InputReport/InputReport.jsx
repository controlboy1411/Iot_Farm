import { Breadcrumbs, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useState } from 'react';
import * as api from '../../../../api/api.js';
import i18n from 'i18next';
import { LANGUAGE_TYPE } from '../../../../i18n/type.js';
import { useTranslation } from "react-i18next";
import { removeVietnameseAccent, validateTextFieldInputNumber } from '../../../../utils/helper.js';
import { CustomToastId, LocalStorageKey } from '../../../../utils/constant';
import { toast } from 'react-toastify'; 
import './InputReport.scss';

const InputReport = () => {
    const { t } = useTranslation("translation")
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [houses, setHouses] = useState([])
    const [houseSelect, setHouseSelect] = useState(0)

    const reportInforInit = {
        roosterDie: '', henDie: '', roosterRemove: '', henRemove: '', roosterFeedMass: '', henFeedMass: '', 
        totalEgg: '', selectEgg: '', overSizeEgg: '', underSizeEgg: '', deformedEgg: '', dirtyEgg: '', 
        beatenEgg: '', brokenEgg: ''
    }
    const [reportInfor, setReportInfor] = useState(reportInforInit)
    const [submit, setSubmit] = useState(false)

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }

    const handleChangeHouseSelect = (event) => {
        setHouseSelect(event.target.value)
    }

    const handleChangeReportInfor = (property, newValue) => {
        setReportInfor({...reportInfor, [property]: newValue})
    }

    const handleClickCancelButton = () => {
        setReportInfor(reportInforInit)
    }

    const handleClickSaveButton = () => {
        setSubmit(true)
    }

    useEffect(() => {
        const fetchMasterDataFarm = async function() {
            const resultApi = await api.getMasterDataFarms()
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setFarms(resultApi.data.data)
                setFarmSelect(resultApi.data.data[0]?.farmId || 0)
            }
        }

        fetchMasterDataFarm()
    }, [])

    useEffect(() => {
        const fetchMasterDataHouse = async function() {
            const resultApi = await api.getMasterDataHouses(farmSelect)
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setHouses(resultApi.data.data)
                setHouseSelect(resultApi.data.data[0]?.houseId || 0)
            }
        }

        fetchMasterDataHouse()
    }, [farmSelect])

    useEffect(() => {
        if (submit) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.SaveReport)) {
                    toast.update(CustomToastId.SaveReport, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.SaveReport })
                }
    
                try {
                    const resultApi = await api.saveReport({
                        ...reportInfor, 
                        farmId: farmSelect, 
                        houseId: houseSelect, 
                        creatorId: Number(localStorage.getItem(LocalStorageKey.User_Id) || 0)
                    })
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        toast.update(CustomToastId.SaveReport, { render: t('notify.save_report_success'), type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.SaveReport, { render: t('notify.save_report_fail'), type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.SaveReport, { render: t('notify.save_report_fail'), type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
            }
            postData()
        }
    }, [submit])

    return (
        <div>
            <div className='input-report-tab-container-0'>
                <div>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Typography color='gray' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report')}</Typography>
                        <Typography color='text.primary' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report_input')}</Typography>
                    </Breadcrumbs>
                </div>
                <Paper elevation={2}>
                    <div className='input-report-tab-container-0-1'>
                        <Stack direction='row' alignItems='center' marginBottom={2}>
                            <AddCardIcon fontSize='large' sx={{color: '#0C4DA0', marginRight: '12px'}} />
                            <Typography sx={{fontSize: '24px', fontWeight: '600'}}>{t('input_report_title')}</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <FormControl fullWidth classes={{root: 'input-report-tab-container-0-1-form-control-root'}}>
                                <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                                <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                                    {farms.map(farm => (
                                        <MenuItem value={farm.farmId}>
                                            {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth classes={{root: 'input-report-tab-container-0-1-form-control-root'}}>
                                <InputLabel>{t('dropdown_house_label')}</InputLabel>
                                <Select value={houseSelect} label={t('dropdown_house_label')} onChange={handleChangeHouseSelect}>
                                    {houses.map(house => (
                                        <MenuItem value={house.houseId}>
                                            {`${t('dropdown_house_label')} ${house.houseNumber}`}
                                        </MenuItem>
                                    ))} 
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.number_of_dead_rooster')} sx={{width: '250px'}} 
                                value={reportInfor.roosterDie} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('roosterDie', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_eliminated_rooster')} sx={{width: '250px'}} 
                                value={reportInfor.roosterRemove} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('roosterRemove', event.target.value)}
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.number_of_dead_hen')} sx={{width: '250px'}} 
                                value={reportInfor.henDie} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('henDie', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_eliminated_hen')} sx={{width: '250px'}} 
                                value={reportInfor.henRemove} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('henRemove', event.target.value)}
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={4}>
                            <TextField variant='outlined' label={t('report.amount_of_rooster_food')} sx={{width: '250px'}} 
                                value={reportInfor.roosterFeedMass}
                                onChange={(event) => handleChangeReportInfor('roosterFeedMass', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.amount_of_hen_food')} sx={{width: '250px'}} 
                                value={reportInfor.henFeedMass}
                                onChange={(event) => handleChangeReportInfor('henFeedMass', event.target.value)}
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.total_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.totalEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('totalEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_incubated_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.selectEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('selectEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_big_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.overSizeEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('overSizeEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_small_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.underSizeEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('underSizeEgg', event.target.value)}
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={4}>
                            <TextField variant='outlined' label={t('report.number_of_malformed_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.deformedEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('deformedEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_dirty_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.dirtyEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('dirtyEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_beaten_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.beatenEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('beatenEgg', event.target.value)}
                            />
                            <TextField variant='outlined' label={t('report.number_of_broken_eggs')} sx={{width: '150px'}} 
                                value={reportInfor.brokenEgg} onKeyDown={validateTextFieldInputNumber} 
                                onChange={(event) => handleChangeReportInfor('brokenEgg', event.target.value)}
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Button variant='contained' onClick={handleClickSaveButton}
                                sx={{height: '32px', width: '100px', textTransform: 'none', backgroundColor: '#0C4DA0'}}
                            >
                                {t('button.save_title')}
                            </Button>
                            <Button variant='outlined' onClick={handleClickCancelButton}
                                sx={{height: '32px', width: '100px', textTransform: 'none', color: '#0C4DA0'}}
                            >
                                {t('button.cancel_title')}
                            </Button>
                        </Stack>
                    </div>
                </Paper>
            </div>
        </div>
    )
}

export default InputReport;