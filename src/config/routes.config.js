import { FaGripHorizontal, FaSignOutAlt, FaUsers, FaLayerGroup, FaListAlt } from "react-icons/fa";
import { Circle as CircleIcon } from '@mui/icons-material';
import * as permission from './authorization.config';

export const ROUTE_PATH = {
    HOME: '/home',
    DASHBOARD: '/dashboard',
    REPORT: '/report',
    REPORT_INPUT: '/report/input',
    REPORT_REVIEW: '/report/review',
    REPORT_OUTPUT: '/report/output',
    ADMIN: '/admin',
    ADMIN_USER: '/admin/user',
    ADMIN_FARM: '/admin/farm',
    LOGIN: '/',
    NOT_FOUND: '*'
}

export const ROUTE_KEY = {
    HOME: 'r0',
    DASHBOARD: 'r3',
    ADMIN: 'r5',
    LOGIN: 'r6',
    REPORT: 'r7'
}

export const adminSubRoutes = [
    { key: ROUTE_KEY.ADMIN + '_s1', path: ROUTE_PATH.ADMIN_USER, name: 'menu_admin_user', icon: <CircleIcon sx={{fontSize: '6px'}} />, subRoutes: [], roles: permission.AdminPermission },
    { key: ROUTE_KEY.ADMIN + '_s2', path: ROUTE_PATH.ADMIN_FARM, name: 'menu_admin_farm', icon: <CircleIcon sx={{fontSize: '6px'}} />, subRoutes: [], roles: permission.AdminPermission },
]

export const reportSubRoutes = [
    { key: ROUTE_KEY.REPORT + '_s1', path: ROUTE_PATH.REPORT_INPUT, name: 'menu_report_input', icon: <CircleIcon sx={{fontSize: '6px'}} />, subRoutes: [], roles: permission.AllPermisson },
    { key: ROUTE_KEY.REPORT + '_s2', path: ROUTE_PATH.REPORT_REVIEW, name: 'menu_report_review', icon: <CircleIcon sx={{fontSize: '6px'}} />, subRoutes: [], roles: permission.AllPermisson },
    { key: ROUTE_KEY.REPORT + '_s3', path: ROUTE_PATH.REPORT_OUTPUT, name: 'menu_report_output', icon: <CircleIcon sx={{fontSize: '6px'}} />, subRoutes: [], roles: permission.AllPermisson },
]

export const routes = [
    { key: ROUTE_KEY.HOME, path: ROUTE_PATH.HOME, name: 'menu_home', icon: <FaListAlt />, subRoutes: [], roles: permission.OverviewPermisson },
    { key: ROUTE_KEY.DASHBOARD, path: ROUTE_PATH.DASHBOARD, name: 'menu_dashboard', icon: <FaGripHorizontal />, subRoutes: [], roles: permission.DashboardPermission },
    { key: ROUTE_KEY.ADMIN, path: ROUTE_PATH.ADMIN, name: 'menu_admin', icon: <FaUsers />, subRoutes: adminSubRoutes, roles: permission.AdminPermission },
    { key: ROUTE_KEY.REPORT, path: ROUTE_PATH.REPORT, name: 'menu_report', icon: <FaLayerGroup />, subRoutes: reportSubRoutes, roles: permission.AllPermisson },
    { key: ROUTE_KEY.LOGIN, path: ROUTE_PATH.LOGIN, name: 'menu_logout', icon: <FaSignOutAlt />, subRoutes: [], roles: permission.AllPermisson },
]