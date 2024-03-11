import { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useQueryParams, useSetQueryParams } from "../../hook";
import * as api from "../../api/api";
import './ListHouse.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faDroplet, faWind, faFlask, faCloudBolt, faFan, faLightbulb, faSun } from '@fortawesome/free-solid-svg-icons';

const ListHouse = (props) => {
    const { farmId } = props
    const [listHouse, setListHouse] = useState({
        loading: false,
        data: []
    });
    const queryParams = useQueryParams()
    const setQueryParams = useSetQueryParams()

    const handleClickHouse = useCallback((houseId) => {
        setQueryParams('/farm/dashboard', {
            ...queryParams,
            house_id: houseId
        })
    }, [queryParams, setQueryParams])

    useEffect(() => {
        const fetchData = async () => {
            setListHouse({ loading: true, data: [] })
            const listHouseResponse = await api.getListHouse(farmId);
            setListHouse({ loading: false, data: listHouseResponse.data.data })
        };
        fetchData();
    }, []);

    return (
        <>
            {listHouse.loading ? (
                <div className="d-flex flex-wrap justify-content-center">
                    <Spinner animation="grow" variant="success" style={{}} />
                </div>
            ) : (

                <div className="d-flex justify-content-center align-items-center">
                    {listHouse.data.length > 0 ?
                    <div className="d-flex row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3">
                        {listHouse.data.map((house, index) => (
                        <div key={index} className="text-decoration-none card p-2 col common-card" style={{ border: "none" }} onClick={() => {
                            handleClickHouse(house.houseId)
                        }}>
                            <div className={house.isActive ? "card-header active-card-header" : "card-header no-active-card-header"}>
                                {`Chuồng ${house.houseId}`}
                            </div>

                            <div className={house.isActive ? "card-body active-card-body" : "card-body no-active-card-body"}>
                                {house.isActive ?
                                    <div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faTemperatureThreeQuarters} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Nhiệt độ: {house.temperature || '--'} &deg;C</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faDroplet} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Độ ẩm: {house.humidity || '--'} %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faCloudBolt} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Nồng độ CO2: {house.co2 || '--'} %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faFlask} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Nồng độ NH3: {house.nh3 || '--'} %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faFan} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Quạt: {house.windStatus ? (house.windSpeed != null && Number(house.windSpeed) > 0 ? "ON" : "OFF") : '--'}</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faLightbulb} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Đèn: {house.lightStatus ? (house.lightIntensity != null && Number(house.lightIntensity) > 0 ? "ON" : "OFF") : '--'}</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faWind} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Tốc độ gió: {house.windSpeed ? (Number(house.windSpeed) * 196.85).toFixed(2) : '--'} ft/m</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faSun} size="1x" className="icon-temp-active" />
                                            <span className="card-title card-title-custom">Ánh sáng: {house.lightIntensity ? Number(house.lightIntensity).toFixed(2) : '--'} lux</span>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faTemperatureThreeQuarters} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Nhiệt độ: -- &deg;C</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faDroplet} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Độ ẩm: -- %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faCloudBolt} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Nồng độ CO2: -- %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faFlask} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Nồng độ NH3: -- %</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faFan} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Trạng thái quạt: --</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faLightbulb} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Trạng thái đèn: --</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faWind} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Tốc độ gió: -- ft/min</span>
                                        </div>
                                        <div className="item-house-infor">
                                            <FontAwesomeIcon icon={faSun} size="1x" className="icon-temp-no-active" />
                                            <span className="card-title card-title-custom-no-active">Cường độ sáng: -- lux</span>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div> : 
                    <div className="list-house-no-data">
                        Không có dữ liệu về các chuồng nuôi
                    </div>
                    }
                    
                </div >
            )}
        </>
    )
}

export default ListHouse;