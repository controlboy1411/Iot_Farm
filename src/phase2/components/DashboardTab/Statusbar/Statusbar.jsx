import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faDroplet, faWind, faFlask, faCloudBolt, faFan, faLightbulb, faSun, faWater, faFillDrip } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import * as api from '../../../../api/api.js';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { getHouseStandard } from '../../../../utils/helper.js';
import { ValueStandard, PropertyStandard } from '../../../../utils/constant.js';
import '../Statusbar/Statusbar.scss';

const StatusBar = (props) => {
    const { houseId, dateSelect, week } = props
    const [statusData, setStatusData] = useState({})
    const [standard, setStandard] = useState({})
    const [className, setClassName] = useState({})
    const [render, setRender] = useState(false)
    const { t } = useTranslation("translation")

	setInterval(() => {
		setRender(!render)
	}, 1000 * 300) // 5 phut

    const getClassNameStandard = (newStandard) => {
        const keys = Object.keys(newStandard)
        let newClassName = {}
        for (const key of keys) {
            if (newStandard[key] === ValueStandard.Good) {
                newClassName[key] = 'status-bar-item-body-title-status-good'
                newClassName[key] = 'status-bar-item-body-title-status-good'
            } else if (newStandard[key] === ValueStandard.Medium) {
                newClassName[key] = 'status-bar-item-body-title-status-medium'
                newClassName[key] = 'status-bar-item-body-title-status-medium'
            } else if (newStandard[key] === ValueStandard.Bad) {
                newClassName[key] = 'status-bar-item-body-title-status-bad'
                newClassName[key] = 'status-bar-item-body-title-status-bad'
            } else {
                newClassName[key] = 'status-bar-item-body-title-status-no'
                newClassName[key] = 'status-bar-item-body-title-status-no'
            }
        }
        return newClassName
    }

    useEffect(() => {
        const fetchData = async () => {
            const statusBarData = await api.getStatusBarData(houseId)
            if (statusBarData.data?.data) {
                const statusBarResult = statusBarData.data?.data
                statusBarResult.Wind_Status = statusBarResult?.Wind_Speed && Number(statusBarResult?.Wind_Speed) > 0 ? 'ON' : 'OFF'
                statusBarResult.Light_Status = statusBarResult?.Light_Intensity && Number(statusBarResult?.Light_Intensity) > 0 ? 'ON' : 'OFF'
                statusBarResult.Wind_Status = statusBarResult?.Wind_Speed && Number(statusBarResult?.Wind_Speed) > 0 ? 'ON' : 'OFF'
                statusBarResult.Light_Status = statusBarResult?.Light_Intensity && Number(statusBarResult?.Light_Intensity) > 0 ? 'ON' : 'OFF'
                setStatusData(statusBarResult)
                let obj = {}
                obj[PropertyStandard.Temp] = statusBarResult?.Temperature
                obj[PropertyStandard.WinSpeed] = statusBarResult?.Wind_Speed
                obj[PropertyStandard.Humi] = statusBarResult?.Humidity
                obj[PropertyStandard.Co2] = statusBarResult?.CO2
                const newStandard = getHouseStandard(week, obj)
                setStandard({ ...standard, ...newStandard })
                const newClassName = getClassNameStandard(newStandard)
                setClassName({ ...className, ...newClassName })
            } else {
                setStatusData({})
                setStandard({})
                setClassName(getClassNameStandard({}))
            }
        }

        fetchData()
    }, [houseId, dateSelect, week, render])

    return (
        <div>
            <div className='row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 row-cols-xxl-5'>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faTemperatureThreeQuarters} className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('temperature')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.Temperature ? Number(statusData?.Temperature).toFixed(2) : '0.00'} &deg;C</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faDroplet} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('humidity')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.Humidity ? Number(statusData?.Humidity).toFixed(2) : '0.00'} %</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faCloudBolt} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>CO2</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.CO2 ? Number(statusData?.CO2).toFixed(3) : '0.000'} %</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faFlask} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>NH3</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.NH3 ? Number(statusData?.NH3).toFixed(3) : '0.000'} %</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faWind} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('wind_speed')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.Wind_Speed ? (Number(statusData?.Wind_Speed) * 196.85).toFixed(2) : '0.00'} ft/m</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faSun} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('light')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>{statusData?.Light_Intensity ? Number(statusData?.Light_Intensity).toFixed(2) : '0.00'} lux</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faFan} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('fan')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>
                                <div className='status-bar-item-body-value-content'>{statusData?.Wind_Status || 'OFF'}</div>
                                <div className='status-bar-item-body-value-icon'>
                                {statusData?.Wind_Status === 'ON' ?
                                    <Switch color='primary' disableRipple checked={true}/> :
                                    <Switch color='default' disableRipple checked={false}/>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faLightbulb} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('lamp')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>
                                <div className='status-bar-item-body-value-content'>{statusData?.Light_Status || 'OFF'}</div>
                                <div className='status-bar-item-body-value-icon'>
                                {statusData?.Light_Status === 'ON' ?
                                    <Switch color='primary' disableRipple checked={true}/> :
                                    <Switch color='default' disableRipple checked={false}/>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faWater} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('water_flow')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>{Number(54.25).toFixed(2)} m&sup3;/h</div>
                        </div>
                    </div>
                </div>
                <div className='status-bar-item-pos col'>
                    <div className='status-bar-item'>
                        <div className='status-bar-item-body'>
                            <div className='status-bar-item-body-title'>
                                <FontAwesomeIcon icon={faFillDrip} size="1x" className='status-bar-item-body-title-content-icon' />
                                <div className='status-bar-item-body-title-content-name'>{t('water_status')}</div>
                            </div>
                            <div className='status-bar-item-body-value'>
                                <div className='status-bar-item-body-value-content'>{statusData?.Light_Status || 'OFF'}</div>
                                <div className='status-bar-item-body-value-icon'>
                                {statusData?.Light_Status === 'ON' ?
                                    <Switch color='primary' disableRipple checked={true}/> :
                                    <Switch color='default' disableRipple checked={false}/>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default StatusBar;