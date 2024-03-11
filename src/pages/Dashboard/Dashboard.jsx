import { Header, DashboardDetails, MenuTab } from '../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useQueryParams } from '../../hook';
import { CustomToastId, LocalStorageKey } from '../../utils/constant';
import { DashboardPermission } from '../../config/authorization.config';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import "./Dashboard.scss";

const Dashboard = () => {
	const query = useQueryParams()
	const houseId = query.house_id || ''
	const userId = localStorage.getItem(LocalStorageKey.User_Id)
	const userRole = localStorage.getItem(LocalStorageKey.User_Role)

	if (!userId || !userRole) {
        toast.warning('Vui lòng đăng nhập lại', { toastId: CustomToastId.LoginRequire })
    }

    if (userId && userRole && !DashboardPermission.includes(Number(userRole))) {
        toast.warning('Bạn không có quyền truy cập trang này', { toastId: CustomToastId.LoginRequire })
    }

	return (
		<>
			{userId && DashboardPermission.includes(Number(userRole)) && (
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
							<div className="main-page">
								<Header />
								<DashboardDetails houseId={houseId}/>
							</div>
						</Box>
					</Box>
				</ThemeProvider>
			)}
		</>
	);
};

export default Dashboard;
