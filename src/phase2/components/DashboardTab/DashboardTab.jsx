import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TableViewIcon from '@mui/icons-material/TableView';
import dayjs from 'dayjs';
import moment from 'moment';
import StatusBar from './Statusbar/Statusbar.jsx';
import ListChartView from './ChartView/ListChartView.jsx';
import DataTable from './DataTable/DataTable.jsx';
import * as api from '../../../api/api.js';
import i18n from "i18next";
import { LANGUAGE_TYPE } from '../../../i18n/type';
import { removeVietnameseAccent } from '../../../utils/helper.js';
import './DashboardTab.scss';

const DashboardTab = () => {
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [houses, setHouses] = useState([])
    const [houseSelect, setHouseSelect] = useState(0)
    const [dateSelect, setDateSelect] = useState(dayjs(moment().format('YYYY-MM-DD')))
    const [week, setWeek] = useState(9)
    const { t } = useTranslation("translation")

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }

    const handleChangeHouseSelect = (event) => {
        setHouseSelect(event.target.value)
    }

    const handleChangeDateSelect = (value) => {
        setDateSelect(value)
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
            <div className='dashboard-tab-container-0'>
                <div className='dashboard-tab-title'>{t('menu_dashboard')}</div>
                <Stack direction='row' alignItems='center' spacing={2} marginTop={1}>
                    <FormControl fullWidth classes={{root: 'dashboard-tab-container-0-1-form-control-root'}}>
                        <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                        <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                            {farms.map(farm => (
                                <MenuItem value={farm.farmId}>
                                    {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                </MenuItem>
                            ))} 
                        </Select>
                    </FormControl>
                    <FormControl fullWidth classes={{root: 'dashboard-tab-container-0-1-form-control-root'}}>
                        <InputLabel>{t('dropdown_house_label')}</InputLabel>
                        <Select value={houseSelect} label={t('dropdown_house_label')} onChange={handleChangeHouseSelect}>
                            {houses.map(house => (
                                <MenuItem value={house.houseId}>
                                    {`${t('dropdown_house_label')} ${house.houseNumber}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className='dashboard-tab-container-0-1-datepicker'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} >
                                <DemoItem>
                                    <DatePicker label={t('date_picker_choose_date')} format='DD-MM-YYYY'
                                        value={dateSelect}
                                        onChange={(newValue) => handleChangeDateSelect(newValue)}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                </Stack>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='dashboard-tab-container-0-2'>
                        <StatusBar houseId={houseSelect} dateSelect={dateSelect} week={week}/>
                    </div>
                </Paper>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='dashboard-tab-container-0-2'>
                        <Stack direction='row' alignItems='flex-end' spacing={1}>
                            <AssessmentIcon fontSize='large' sx={{ color: '#0C4DA0' }}/>
                            <Typography sx={{fontSize: '20px', fontWeight: '600'}}>{t('dashboard_tab_data_chart')}</Typography>
                        </Stack>
                        <ListChartView houseId={houseSelect} dateSelect={dateSelect}/>
                    </div>
                </Paper>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='dashboard-tab-container-0-2'>
                        <Stack direction='row' alignItems='flex-end' spacing={1} marginBottom={2}>
                            <TableViewIcon fontSize='large' sx={{ color: '#0C4DA0' }}/>
                            <Typography sx={{fontSize: '20px', fontWeight: '600'}}>{t('dashboard_tab_data_table')}</Typography>
                        </Stack>
                        <DataTable houseId={houseSelect} dateSelect={dateSelect}/>
                    </div>
                </Paper>
            </div>
        </div>
    )
}

export default DashboardTab;