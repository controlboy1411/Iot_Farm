import { Header, FarmCard, MenuTab } from '../../components';
import { CustomToastId, LocalStorageKey } from '../../utils/constant';
import { HomePermission } from '../../config/authorization.config';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import './Home.scss';

const Home = () => {
    const userId = localStorage.getItem(LocalStorageKey.User_Id)
	const userRole = localStorage.getItem(LocalStorageKey.User_Role)
    localStorage.setItem(LocalStorageKey.Farm_Id_Selected, '')
	
    if (!userId || !userRole) {
        toast.warning('Vui lòng đăng nhập lại', { toastId: CustomToastId.LoginRequire })
    }

    if (userId && userRole && !HomePermission.includes(Number(userRole))) {
        toast.warning('Bạn không có quyền truy cập trang này', { toastId: CustomToastId.LoginRequire })
    }

    const farmIds = localStorage.getItem(LocalStorageKey.Farm_Ids)?.split(',') || []

    return (
        <>
            {userId && HomePermission.includes(Number(userRole)) && (
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
                                <h3 className='title'>Danh sách các Farm đang quản lý</h3>
                                <div className='d-flex flex-row row justify-content-center align-items-center'>
                                    {farmIds.map(farmId => {
                                        return (
                                            <div className='col d-flex justify-content-center align-items-center'>
                                                <FarmCard farmId={farmId}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Box>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
}

export default Home;