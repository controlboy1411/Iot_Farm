import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography, LinearProgress, Box } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import Co2Icon from '@mui/icons-material/Co2';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';
import WaterIcon from '@mui/icons-material/Water';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { FaFan } from "react-icons/fa";
import React, { useCallback, useEffect, useState } from 'react';
import backgroundImage from '../../../assets/main_background.jpg';
import * as api from '../../../api/api';
import { useQueryParams, useSetQueryParams } from '../../../hook';
import { useTranslation } from "react-i18next";
import { QueryParamKey } from '../../../config/app.config';
import { ROUTE_PATH } from '../../../config/routes.config';
import { removeVietnameseAccent } from '../../../utils/helper';
import i18n from "i18next";
import { LANGUAGE_TYPE } from '../../../i18n/type';
import './HomeTab.scss';

const HomeTab = () => {
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [farmInfor, setFarmInfor] = useState({})
    const [listHouse, setListHouse] = useState({
        loading: false,
        error: false,
        data: []
    })
    const { t } = useTranslation("translation")

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }

    const queryParams = useQueryParams()
    const setQueryParams = useSetQueryParams()

    const handleClickHouse = useCallback((houseId) => {
        setQueryParams(ROUTE_PATH.DASHBOARD, {
            ...queryParams,
            [QueryParamKey.FarmId]: farmSelect,
            [QueryParamKey.HouseId]: houseId
        })
    }, [queryParams, setQueryParams])

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
        const fetchHousesData = async () => {
            setListHouse({ loading: true, error: false, data: [] })
            try {
                const resultApi = await api.getListHouse(Number(farmSelect))
                if (resultApi && resultApi.data && resultApi.data.data) {
                    setListHouse({ loading: false, error: false, data: resultApi.data.data })
                } else {
                    setListHouse({ loading: false, error: true, data: []})
                }
            } catch (err) {
                setListHouse({ loading: false, error: true, data: []})
            }
        }

        fetchHousesData()
    }, [farmSelect])

    useEffect(() => {
        const fetchFarmInfor = async () => {
            const result = await api.getFarmInfor(Number(farmSelect))
            if (result && result.data && result.data.data) {
                setFarmInfor(result.data.data)
            }
        }
        fetchFarmInfor()
    }, [farmSelect])

    return (
        <div>
            <div className='home-tab-container-0'>
                <div className='home-tab-title'>{t('menu_home')}</div>
                <div className='home-tab-container-0-1'>
                    <div className='d-flex flex-row align-items-center'>
                        <FormControl fullWidth classes={{root: 'home-tab-container-0-1-form-control-root'}}>
                            <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                            <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                                {farms.map(farm => (
                                    <MenuItem value={farm.farmId}>
                                        {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                    </MenuItem>
                                ))} 
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className='home-tab-container-0-2 mb-3'>
                    <img src={backgroundImage} alt='home_tab' className='home-tab-container-0-2-custom-img' />
                    <div className='home-tab-container-0-2-gradient-overlay'>
                        <div className='home-tab-container-0-2-content'>
                            <div className='home-tab-container-0-2-content-farm-name'>
                                Farm {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? (farmInfor?.farmName || '') : removeVietnameseAccent(farmInfor?.farmName || '')}
                            </div>
                            <div>{i18n.language === LANGUAGE_TYPE.VIETNAMESE ? (farmInfor?.address || '') : removeVietnameseAccent(farmInfor?.address || '')}</div>
                            <hr style={{opacity: 1}}/>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_total_area')}:</td>
                                        <td>{farmInfor?.farmArea ? Number(farmInfor?.farmArea).toLocaleString() : 0} (ha)</td>
                                    </tr>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_house_area')}:</td>
                                        <td>{farmInfor?.totalHouseArea ? Number(farmInfor?.totalHouseArea).toLocaleString() : 0} {t('home_tab_house_area_unit')}</td>
                                    </tr>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_farming_scale')}:</td>
                                        <td>{farmInfor?.farmScale ? Number(farmInfor?.farmScale).toLocaleString() : 0} {t('home_tab_farming_scale_unit')}</td>
                                    </tr>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_production_scale')}:</td>
                                        <td>{farmInfor?.productionScale ? Number(farmInfor?.productionScale).toLocaleString() : 0} {t('home_tab_production_scale_unit')}</td>
                                    </tr>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_farm_start_date')}:</td>
                                        <td>{farmInfor?.startTime || ''}</td>
                                    </tr>
                                    <tr>
                                        <td className='home-tab-container-0-2-content-table-td-title'>{t('home_tab_total_employees')}:</td>
                                        <td>{farmInfor?.totalEmployees ? Number(farmInfor?.totalEmployees).toLocaleString() : 0} {t('home_tab_total_employees_unit')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {listHouse.loading ? (
                    <Stack direction='column' alignItems='center' spacing={1}>
                        <Typography sx={{fontSize: '15px', fontWeight: '600'}}>{t('loading_data')}</Typography>
                        <Box width='180px'>
                            <LinearProgress />
                        </Box>
                    </Stack>
                ) : (
                    <React.Fragment>
                        {listHouse.error ?
                            <Stack direction='row' spacing={1} alignItems='flex-end' justifyContent='center' marginTop={2}>
                                <WarningIcon color='error'/>
                                <Typography sx={{fontSize: '15px', fontWeight: '600', color: '#3c3c3c'}}>{t('notify.can_not_load_data')}</Typography>
                            </Stack> :
                            <div className='d-flex flex-row row home-tab-container-0-3'>
                                {listHouse.data.map(house => (
                                    <div className='col d-flex flex-row justify-content-center mb-4'>
                                        <div className='home-tab-container-0-3-card'>
                                            <Paper elevation={3} sx={{borderRadius: '8px'}}>
                                                <div className={house.isActive ? 'home-tab-container-0-3-card-header-active' : 'home-tab-container-0-3-card-header-unactive'}>
                                                    <Stack direction='row' justifyContent='space-between' padding='8px 15px'>
                                                        <Typography fontSize='15px'>{`${t('dropdown_house_label')} ${`0${house.houseNumber}`.slice(-2)}`}</Typography>
                                                        <Stack direction='row' alignItems='center'>
                                                            <CircleIcon sx={{width: '8px', color: house.isActive ? '#61eb34' : '#c40502', marginRight: '10px'}}/>
                                                            <Typography fontSize='15px'>{house.isActive ? t('dropdown_status_actived') : t('dropdown_status_unactive')}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </div>
                                                <div className={house.isActive ? 'home-tab-container-0-3-card-body-active' : 'home-tab-container-0-3-card-body-unactive'}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <DeviceThermostatIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('temperature')}:</td>
                                                                <td>{house.temperature ? Number(house.temperature).toFixed(2) : '--'} &deg;C</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <WaterDropIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('humidity')}:</td>
                                                                <td>{house.humidity ? Number(house.humidity).toFixed(2) : '--'} %</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <Co2Icon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('concentration_co2')}:</td>
                                                                <td>{house.co2 ? Number(house.co2).toFixed(2) : '--'} %</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <ScienceOutlinedIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('concentration_nh3')}:</td>
                                                                <td>{house.nh3 ? Number(house.nh3).toFixed(2) : '--'} %</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <FaFan color={house.isActive ? '#074E9F' : '#6d6d6d'} fontSize='large' />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('fan')}:</td>
                                                                <td>{house.windStatus ? (house.windSpeed != null && Number(house.windSpeed) > 0 ? 'On' : 'Off') : '--'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <LightbulbIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('lamp')}:</td>
                                                                <td>{house.lightStatus ? (house.lightIntensity != null && Number(house.lightIntensity) > 0 ? 'On' : 'Off') : '--'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <AirIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('wind_speed')}:</td>
                                                                <td>{house.windSpeed ? (Number(house.windSpeed) * 196.85).toFixed(2) : '--'} ft/min</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <LightModeIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('light')}:</td>
                                                                <td>{house.lightIntensity ? Number(house.lightIntensity).toFixed(2) : '--'} lux</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <WaterIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('water_flow')}:</td>
                                                                <td>{Number(54.25).toFixed(2)} m&sup3;/h</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='home-tab-container-0-3-card-body-table-td-1'>
                                                                    <FormatColorFillIcon fontSize='small' sx={{color: house.isActive ? '#074E9F' : '#6d6d6d'}} />
                                                                </td>
                                                                <td className='home-tab-container-0-3-card-body-table-td-2'>{t('water_status')}:</td>
                                                                <td>{'ON'}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className={house.isActive ? 'home-tab-container-0-3-card-footer-active' : 'home-tab-container-0-3-card-footer-unactive'}>
                                                    <Button 
                                                        variant='contained' fullWidth 
                                                        classes={{root: house.isActive ? 'home-tab-container-0-1-btn-root' : 'home-tab-container-0-1-btn-root-unactive'}}
                                                        onClick={() => handleClickHouse(house.houseId)}
                                                    >
                                                        {t('button.detail_title')}
                                                    </Button>
                                                </div>
                                            </Paper>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}

export default HomeTab;