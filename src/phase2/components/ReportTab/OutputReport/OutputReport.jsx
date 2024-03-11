import { Breadcrumbs, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import DatasetIcon from '@mui/icons-material/Dataset';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { FaFileExcel } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import SummaryTable from './SummaryTable/SummaryTable.jsx';
import DetailTable from './DetailTable/DetailTable.jsx';
import * as api from '../../../../api/api.js';
import i18n from "i18next";
import { LANGUAGE_TYPE } from '../../../../i18n/type';
import { useTranslation } from "react-i18next";
import { removeVietnameseAccent } from '../../../../utils/helper.js';
import './OutputReport.scss';

const OutputReport = () => {
    const { t } = useTranslation('translation')
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [houses, setHouses] = useState([])
    const [houseSelect, setHouseSelect] = useState(0)
    const [fromDateSelect, setFromDateSelect] = useState(dayjs(moment().format('YYYY-MM-DD')))
    const [toDateSelect, setToDateSelect] = useState(dayjs(moment().format('YYYY-MM-DD')))

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }
 
    const handleChangeHouseSelect = (event) => {
        setHouseSelect(event.target.value)
    }

    const handleChangeFromDateSelect = (value) => {
        setFromDateSelect(value)
    }

    const handleChangeToDateSelect = (value) => {
        setToDateSelect(value)
    }

    const handleClickExportButton = () => {

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

    return (
        <div>
            <div className='output-report-tab-container-0'>
                <div>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Typography color='gray' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report')}</Typography>
                        <Typography color='text.primary' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report_output')}</Typography>
                    </Breadcrumbs>
                </div>
                <div className='d-flex flex-row row align-items-center mt-1'>
                    <div className='col-10 d-flex flex-row align-items-center justify-content-start'>
                        <FormControl fullWidth classes={{root: 'output-report-tab-container-0-1-form-control-root'}}>
                            <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                            <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                                {farms.map(farm => (
                                    <MenuItem value={farm.farmId}>
                                        {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth classes={{root: 'output-report-tab-container-0-1-form-control-root'}} sx={{marginLeft: 2}}>
                            <InputLabel>{t('dropdown_house_label')}</InputLabel>
                            <Select value={houseSelect} label={t('dropdown_house_label')} onChange={handleChangeHouseSelect}>
                                {houses.map(house => (
                                    <MenuItem value={house.houseId}>
                                        {`${t('dropdown_house_label')} ${house.houseNumber}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className='output-report-tab-container-0-1-datepicker'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} >
                                    <DemoItem>
                                        <DatePicker label={t('date_picker_from_date')} format='DD-MM-YYYY'
                                            value={fromDateSelect}
                                            onChange={(newValue) => handleChangeFromDateSelect(newValue)}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <div className='output-report-tab-container-0-1-datepicker'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} >
                                    <DemoItem>
                                        <DatePicker label={t('date_picker_to_date')} format='DD-MM-YYYY'
                                            value={toDateSelect}
                                            onChange={(newValue) => handleChangeToDateSelect(newValue)}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='col-2 d-flex justify-content-end'>
                        <Button variant='contained' startIcon={<FaFileExcel style={{fontSize: '15px'}}/>}
                            classes={{root: 'output-report-tab-container-0-1-search-btn-root'}}
                            onClick={handleClickExportButton}
                        >
                            {t('button.export_excel')}
                        </Button>
                    </div>
                </div>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='output-report-tab-container-0-2'>
                        <Stack direction='row' alignItems='center' marginBottom={2}>
                            <DatasetIcon fontSize='large' sx={{color: '#0C4DA0', marginRight: '12px'}} />
                            <Typography sx={{fontSize: '24px', fontWeight: '600'}}>{t('output_report_general_data_title')}</Typography>
                        </Stack>
                        <SummaryTable 
                            farmId={farmSelect} houseId={houseSelect} 
                            fromDate={fromDateSelect} toDate={toDateSelect}
                        />
                    </div>
                </Paper>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='output-report-tab-container-0-2'>
                        <Stack direction='row' alignItems='center' marginBottom={2}>
                            <BackupTableIcon fontSize='large' sx={{color: '#0C4DA0', marginRight: '12px'}} />
                            <Typography sx={{fontSize: '24px', fontWeight: '600'}}>{t('output_report_detail_data_title')}</Typography>
                        </Stack>
                        <DetailTable 
                            farmId={farmSelect} houseId={houseSelect} 
                            fromDate={fromDateSelect} toDate={toDateSelect}
                        />
                    </div>
                </Paper>
            </div>
        </div>
    )
}

export default OutputReport;