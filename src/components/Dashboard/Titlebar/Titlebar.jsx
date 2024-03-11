import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { useEffect, useState, useCallback } from 'react';
import * as api from '../../../api/api';
import { useQueryParams, useSetQueryParams } from '../../../hook';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import TextField from '@mui/material/TextField';
import { LocalStorageKey } from '../../../utils/constant';
import { ActiveHousePermission } from '../../../config/authorization.config';
import "../Titlebar/Titlebar.scss";

const TitleBar = (props) => {
    const { houseID, setShowForm } = props
    const [previosHouseId, setPreviousId] = useState(houseID)
    const [nextHouseId, setNextId] = useState(houseID)
    const [houseData, setHouseData] = useState({})
    const [showActiveHouse, setShowActiveHouse] = useState(false)
    const [showFormHouseInfor, setShowFormHouseInfor] = useState(false)
    const [responsiveType, setResponsiveType] = useState(window.innerWidth >= 500 ? 1 : 2)

    const userId = localStorage.getItem(LocalStorageKey.User_Id)
	const userRole = localStorage.getItem(LocalStorageKey.User_Role)

    const queryParams = useQueryParams()
    const setQueryParams = useSetQueryParams()

    window.addEventListener('resize', () => {
        setResponsiveType(window.innerWidth >= 500 ? 1 : 2)
    })

    const handleClickNextHouse = useCallback(() => {
        setQueryParams('', {
            ...queryParams,
            house_id: nextHouseId
        })
    }, [queryParams, setQueryParams])

    const handleClickPreviousHouse = useCallback(() => {
        setQueryParams('', {
            ...queryParams,
            house_id: previosHouseId
        })
    }, [queryParams, setQueryParams])

    useEffect(() => {
        const fetchData = async () => {
            const transferPage = await api.getTransferPageInfor(houseID)
            const transferPageData = transferPage?.data?.data
            if (transferPageData) {
                setPreviousId(transferPageData.previous)
                setNextId(transferPageData.next)
            }

            const houseInfor = await api.getHouseInfor(houseID)
            if (houseInfor.data?.data) {
                setHouseData(houseInfor.data?.data)
                setShowActiveHouse(houseInfor.data?.data?.Is_Active == 1 ? false : true)
            }
        }

        fetchData()
    }, [houseID])

    return (
        <>
            <div className="container-fluid justify-content-center align-items-center flex-md-row common-bar">
                <div className='d-flex justify-content-center'>
                    {responsiveType === 1 ?
                    <>
                        <div>
                            <Button variant="outline-success" className="arrow-left-button" onClick={handleClickPreviousHouse}>
                                <FontAwesomeIcon icon={faArrowLeft} className="icon-arrow" />
                            </Button>
                        </div>
                        <div className="house-name">
                            {`${houseData?.House_Name || ''}`}
                        </div>
                        <div>
                            <Button variant="outline-success" className="arrow-right-button" onClick={handleClickNextHouse}>
                                <FontAwesomeIcon icon={faArrowRight} className="icon-arrow" />
                            </Button>
                        </div>
                        <>
                            {userId && ActiveHousePermission.includes(Number(userRole)) && showActiveHouse && (
                                <div>
                                    <Button variant="outline-success" className="arrow-right-button" onClick={() => setShowForm(true)}>
                                        <ControlPointIcon />
                                    </Button>
                                </div>
                            )}
                        </>
                        <>
                            {!showActiveHouse && (
                                <div className='d-flex justify-content-center'>
                                    <Button variant="outline-success" className="arrow-right-button" onClick={() => setShowFormHouseInfor(true)}>
                                        <DonutSmallIcon />
                                    </Button>
                                </div>
                            )}
                        </>
                    </> : 
                    <div className='d-flex flex-column'>
                        <div className='d-flex flex-row justify-content-center'>
                            <div className="house-name">
                                {`${houseData?.House_Name || ''}`}
                            </div>
                        </div>
                        <div className='d-flex flex-row justify-content-center mt-3'>
                            <div>
                                <Button variant="outline-success" className="arrow-left-button" onClick={handleClickPreviousHouse}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="icon-arrow" />
                                </Button>
                            </div>
                            <>
                                {userId && ActiveHousePermission.includes(Number(userRole)) && showActiveHouse && (
                                    <div>
                                        <Button variant="outline-success" className="arrow-center-button" onClick={() => setShowForm(true)}>
                                            <ControlPointIcon />
                                        </Button>
                                    </div>
                                )}
                            </>
                            <>
                                {!showActiveHouse && (
                                    <div className='d-flex justify-content-center'>
                                        <Button variant="outline-success" className="arrow-center-button" onClick={() => setShowFormHouseInfor(true)}>
                                            <DonutSmallIcon />
                                        </Button>
                                    </div>
                                )}
                            </>
                            <div>
                                <Button variant="outline-success" className="arrow-right-button" onClick={handleClickNextHouse}>
                                    <FontAwesomeIcon icon={faArrowRight} className="icon-arrow" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <Modal show={showFormHouseInfor} animation onHide={() => setShowFormHouseInfor(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as='h5'>Thông tin cơ bản {houseData?.House_Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Stack direction="horizontal" gap={5} className="mb-4">
                            <TextField label="Lứa nuôi" variant="outlined" value={houseData?.Batch_No || 'Không có dữ liệu'}/>
                            <TextField label="Tuần tuổi" variant="outlined" value={houseData?.Week_No || 'Không có dữ liệu'}/>
                        </Stack>
                        <Stack direction="horizontal" gap={5} className="mb-2">
                            <TextField label="Số Trống" variant="outlined" value={houseData?.Total_Rooster ? `${houseData?.Total_Rooster} con` : '0 con'}/>
                            <TextField label="Số Mái" variant="outlined" value={houseData?.Total_Hen ? `${houseData?.Total_Hen} con` : '0 con'}/>
                        </Stack>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default TitleBar