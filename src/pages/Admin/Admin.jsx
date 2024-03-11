import { Header, MenuTab, AdminTab } from '../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { LocalStorageKey } from '../../utils/constant';
import { AdminPermission } from '../../config/authorization.config';
import { toast } from 'react-toastify';
import { CustomToastId } from '../../utils/constant';
import './Admin.scss';

const Admin = () => {
    const userId = localStorage.getItem(LocalStorageKey.User_Id)
    const userRole = localStorage.getItem(LocalStorageKey.User_Role)
    const farmId = 1

    if (!userId || !userRole) {
        toast.warning('Vui lòng đăng nhập lại', { toastId: CustomToastId.LoginRequire })
    }

    if (userId && userRole && !AdminPermission.includes(Number(userRole))) {
        toast.warning('Bạn không có quyền truy cập trang này', { toastId: CustomToastId.LoginRequire })
    }

    return (
        <>
            {userId && AdminPermission.includes(Number(userRole)) && (
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
                            <div className='admin-main-home'>
                                <Header />
                                <AdminTab />
                            </div>
                        </Box>
                    </Box>
                </ThemeProvider>
            )}
        </>
    )
}

export default Admin;