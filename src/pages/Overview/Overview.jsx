import { Header, MenuTab, ListHouse } from '../../components';
import backgroundImg from '../../assets/main_background.jpg'
import { useQueryParams } from '../../hook';
import { getDataFarm } from '../../utils/fake-data';
import { CustomToastId, LocalStorageKey } from '../../utils/constant';
import { OverviewPermisson } from '../../config/authorization.config';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import './Overview.scss';

const Overview = () => {
    const query = useQueryParams()
    const farmId = query.farm_id || '1'
    const data = getDataFarm(farmId)

    const userId = localStorage.getItem(LocalStorageKey.User_Id)
	const userRole = localStorage.getItem(LocalStorageKey.User_Role)

    if (!userId || !userRole) {
        toast.warning('Vui lòng đăng nhập lại', { toastId: CustomToastId.LoginRequire })
    }

    if (userId && userRole && !OverviewPermisson.includes(Number(userRole))) {
        toast.warning('Bạn không có quyền truy cập trang này', { toastId: CustomToastId.LoginRequire })
    }

    return (
        <>
            {userId && OverviewPermisson.includes(Number(userRole)) && (
                <ThemeProvider theme={createTheme()}>
                    <Box sx={{ display: 'flex' }}>
                        <MenuTab />
                        <Box component="main" sx={{ 
                            backgroundColor: 'white',
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                        }}
                        >
                            <div className='main-home'>
                                <Header />
                                <div className='w-100 d-flex justify-content-center mt-3'>
                                    <div className='container custom-container'>
                                        <img className='img-fluid custom-img' src={backgroundImg} alt='home'/>
                                        <div className='farm-info'>
                                            <div className='farm-info-item-title'>{data.title}</div>
                                            <div className='farm-info-item'>- Địa chỉ: {data.address}</div>
                                            <div className='farm-info-item'>- Tổng diện tích: {data.area.replace('m^2', 'm\u00b2')}</div>
                                            <div className='farm-info-item'>- Diện tích chuồng: {data.totalHouseArea.replace('m^2', 'm\u00b2')}</div>
                                            <div className='farm-info-item'>- Quy mô nuôi: {data.farmScale}</div>
                                            <div className='farm-info-item'>- Quy mô sản xuất: {data.productionScale}</div>
                                            <div className='farm-info-item'>- Bắt đầu hoạt động: {data.startTime}</div>
                                            <div className='farm-info-item'>- Tổng số cán bộ nhân viên: {data.totalEmployees}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center pt-4">
                                    <h3 className='farm-title'>{`CHICKEN ${data.title}`.toUpperCase()}</h3>
                                </div>
                                
                                <hr className='overview-hr'/>
                                <div className='list-house'>
                                    <ListHouse farmId={farmId}/>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
};

export default Overview;
