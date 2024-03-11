import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { FaWarehouse } from "react-icons/fa";
import { Drawer as MuiDrawer, Toolbar, List, IconButton, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TocIcon from '@mui/icons-material/Toc';
import { StyledEngineProvider } from '@mui/material/styles';
import { routes } from '../../config/routes.config';
import * as api from "../../api/api";
import { LocalStorageKey } from "../../utils/constant";
import { useState, useEffect } from 'react';
import { useQueryParams } from "../../hook";
import './MenuTab.scss';


const drawerWidth = 240;
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' }) (
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(8),
                },
            }),
            background: 'rgb(0, 7, 61)',
            color: 'white'
        },
    }),
);

const MenuTab = (props) => {
    const [open, setOpen] = React.useState(window.innerWidth < 768 ? false : true)
    const [farmId, setFarmId] = useState(localStorage.getItem(LocalStorageKey.Farm_Id_Selected))

    const queryParams = useQueryParams()
    const [showMenuR2R3, setShowMenuR2R3] = useState(queryParams?.farm_id ? true : false)

    const routeKeys = routes.map(route => route.key)
    const subMenuStateInit = {}
    routeKeys.map(key => {
        subMenuStateInit[key] = false
    })
    const [subMenuState, setSubMenuState] = useState(subMenuStateInit)
    const [isMobile, setIsMobile] = useState(window.innerWidth > 500 ? false : true)
    const userId = localStorage.getItem(LocalStorageKey.User_Id)
    const userRole = localStorage.getItem(LocalStorageKey.User_Role)

    const toggle = () => {
        if (open) {
            setSubMenuState(subMenuStateInit)
        }
        setOpen(!open);
    };
    const navigate = useNavigate()
    const handleClickMenu = (route) => {
        if (route.key === 'r2') {
            navigate(route.path + `?farm_id=${farmId}`)
        } else if (route.key === 'r3') {
            if (!open) {
                setOpen(true)
            }
            setSubMenuState({...subMenuState, [route.key]: !subMenuState[[route.key]]})
        } else if (route.key === 'r6') {
            localStorage.clear()
            navigate(route.path)
        } else {
            navigate(route.path)
        }
    }

    const handleClickSubMenu = (subRoute) => {
        navigate(subRoute.path)
    }

    const checkExistSubRoute = (route, subRouteName) => {
        if (route['subRoutes'] && Array.isArray(route['subRoutes'])) {
            for (const subRoute of route['subRoutes']) {
                if (subRoute['name'] === subRouteName) {
                    return true
                }
            }
        }
        return false
    }

    const checkDisplayMenu = (route) => {
        if (route.key === 'r2' || route.key === 'r3') {
            return showMenuR2R3
        }
        return true
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            setOpen(false)
            setShowMenuR2R3(false)
        }

        setIsMobile(window.innerWidth > 500 ? false : true)
    })

    useEffect(() => {
        if (farmId) {
            const fetchData = async () => {
                const activeHouses = await api.getActiveHouses(farmId)
                const dataActiveHouse = activeHouses?.data?.data
                for (const house of dataActiveHouse) {
                    let subRouteName = `Chuồng ${house?.House_Id || ''}`
                    routes.map(route => {
                        if (route.name === 'Dashboard' && !checkExistSubRoute(route, subRouteName)) {
                            route.subRoutes.push({
                                path: `/farm/dashboard?farm_id=${farmId}&house_id=${house?.House_Id}`,
                                name: subRouteName,
                                icon: <FaWarehouse />
                            })
                        }
                        setSubMenuState({...subMenuState, [route.key]: !subMenuState[[route.key]]})
                    })
                }
            };

            fetchData();
        } else {
            setShowMenuR2R3(false)
        }
        setFarmId(localStorage.getItem(LocalStorageKey.Farm_Id_Selected))
    }, [farmId]);

    return (
        <StyledEngineProvider injectFirst>
            <Drawer variant="permanent" open={open} sx={{display: isMobile ? 'none' : 'inline'}}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open === true ? 'flex-end' : 'flex-start', px: [1] }}>
                    <IconButton onClick={toggle}>
                    {open === true ? 
                        <ChevronLeftIcon sx={{color: 'white'}} /> : 
                        <ChevronRightIcon sx={{color: 'white'}} />
                    }
                    </IconButton>
                </Toolbar>
                <List component="nav">
                    {routes.map(route => {
                        return userId && route.roles.includes(Number(userRole)) && (
                            <>
                                <ListItemButton sx={{display: !checkDisplayMenu(route) && 'none'}} onClick={() => handleClickMenu(route)}>
                                    <ListItemIcon sx={{minWidth: '40px', color: 'white'}}>{route.icon}</ListItemIcon>
                                    <ListItemText primary={route.name} sx={{display: !open && 'none'}}/>
                                    {route.subRoutes.length > 0 && open && (
                                        <>{subMenuState[route.key] ? <ExpandLess /> : <ExpandMore />}</>
                                    )}
                                </ListItemButton>
                                {route.subRoutes.length > 0 && (
                                    <Collapse in={subMenuState[route.key]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {route.subRoutes.map(subRoute => {
                                                return (
                                                    <ListItemButton onClick={() => handleClickSubMenu(subRoute)}>
                                                        <ListItemIcon sx={{marginLeft: '15px', minWidth: '45px', color: 'white'}}>
                                                            <TocIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={subRoute.name} />
                                                    </ListItemButton>
                                                )
                                            })}    
                                        </List>
                                    </Collapse>
                                )}
                            </>
                        )
                    })}
                </List>
            </Drawer>
        </StyledEngineProvider>
    )
}

export default MenuTab;