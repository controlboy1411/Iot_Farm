import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
	LoginPage, HomePage, DashboardPage, 
	FarmAdministrationPage, UserAdministrationPage, 
	InputReportPage, ReviewReportPage, OutputReportPage, 
	NotFoundPage 
} from './phase2/pages';
import { ROUTE_PATH } from './config/routes.config';
import { ToastContainer } from 'react-toastify';
import { AppContext } from './context/AppContext';
import { LocalStorageKey } from './utils/constant';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	const appContext = useContext(AppContext)

	useEffect(() => {
		if (localStorage.getItem(LocalStorageKey.User_Id) && 
			localStorage.getItem(LocalStorageKey.User_Name) && 
			localStorage.getItem(LocalStorageKey.User_Role) &&
			localStorage.getItem(LocalStorageKey.Full_Name)) {
			appContext.setIsLogin(true)
		} else {
			appContext.setIsLogin(false)
		}
	}, [localStorage.getItem(LocalStorageKey.User_Id), 
		localStorage.getItem(LocalStorageKey.User_Name), 
		localStorage.getItem(LocalStorageKey.User_Role),
		localStorage.getItem(LocalStorageKey.Full_Name)
	])

	return (
		<React.Fragment>
			<BrowserRouter>
				<Routes>
					<Route path={ROUTE_PATH.LOGIN} element={appContext.isLogin ? <Navigate to={ROUTE_PATH.HOME} /> : <LoginPage />}/>
					<Route path={ROUTE_PATH.HOME} element={appContext.isLogin ? <HomePage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.DASHBOARD} element={appContext.isLogin ? <DashboardPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.ADMIN_USER} element={appContext.isLogin ? <UserAdministrationPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.ADMIN_FARM} element={appContext.isLogin ? <FarmAdministrationPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.REPORT_INPUT} element={appContext.isLogin ? <InputReportPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.REPORT_REVIEW} element={appContext.isLogin ? <ReviewReportPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.REPORT_OUTPUT} element={appContext.isLogin ? <OutputReportPage /> : <Navigate to={ROUTE_PATH.LOGIN} />}/>
					<Route path={ROUTE_PATH.NOT_FOUND} element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer pauseOnFocusLoss={false}/>
		</React.Fragment>
	)
};

export default App;
