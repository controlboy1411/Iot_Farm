import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../config/routes.config";
import { Button } from "@mui/material";
import './AccessDenied.scss'

const AccessDenied = () => {
    const navigate = useNavigate()

    const handleClickButton = () => {
        localStorage.clear()
        navigate(ROUTE_PATH.LOGIN)
    }

    return (
        <div className='access-denied-container'>
            <div className='access-denied-subcontainer'>
                <div className='access-denied-content-01'>403</div>
                <div className='access-denied-content-02'>Quyền truy cập bị từ chối</div>
                <div className='access-denied-content-03'>Bạn không có quyền truy cập trang được yêu cầu</div>
                <Button variant='contained' className='access-denied-button' onClick={handleClickButton}>Trở về</Button>
            </div>
        </div>
    )
}

export default AccessDenied