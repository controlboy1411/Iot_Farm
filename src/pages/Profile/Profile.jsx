import { Header, MenuTab, ProfileTab } from '../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { CustomToastId, LocalStorageKey } from '../../utils/constant';
import { ProfilePermission } from '../../config/authorization.config';
import { toast } from 'react-toastify';
import './Profile.scss';

const Profile = () => {
    const userId = localStorage.getItem(LocalStorageKey.User_Id)
	const userRole = localStorage.getItem(LocalStorageKey.User_Role)
	
    if (!userId || !userRole) {
        toast.warning('Vui lòng đăng nhập lại', { toastId: CustomToastId.LoginRequire })
    }

    if (userId && userRole && !ProfilePermission.includes(Number(userRole))) {
        toast.warning('Bạn không có quyền truy cập trang này', { toastId: CustomToastId.LoginRequire })
    }

    return (
        <>
            {userId && ProfilePermission.includes(Number(userRole)) && (
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
                            <div className='profile-main-home'>
                                <Header />
                                <ProfileTab />
                            </div>
                        </Box>
                    </Box>
                </ThemeProvider>
            )}
        </>
    )
}

export default Profile;