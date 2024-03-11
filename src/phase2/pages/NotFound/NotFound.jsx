import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../config/routes.config";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Header, Footer } from '../../components';
import "./NotFound.scss";

const NotFound = () => {
    const navigate = useNavigate()

    const handleClickButton = () => {
        navigate(ROUTE_PATH.HOME)
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header isAuthen={false}/>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
                    <Box component="main" sx={{ backgroundColor: '#f1f1f1', flexGrow: 1 }}>
                        <div className='not-found-container'>
                            <div className='not-found-subcontainer'>
                                <div className='not-found-content-01'>404</div>
                                <div className='not-found-content-02'>Không tìm thấy trang.</div>
                                <div className='not-found-content-03'>Trang bạn đang tìm kiếm có thể đã bị xóa.</div>
                                <Button variant='contained' className='not-found-button' onClick={handleClickButton}>Trở về trang chủ</Button>
                            </div>
                        </div>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default NotFound;