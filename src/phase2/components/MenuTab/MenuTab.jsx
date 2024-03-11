import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Drawer as MuiDrawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { StyledEngineProvider } from '@mui/material/styles';
import { ROUTE_PATH, routes } from '../../../config/routes.config';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { LocalStorageKey } from '../../../utils/constant';
import { AppContext } from '../../../context/AppContext';
import './MenuTab.scss';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' }) (
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
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
            background: 'white',
            color: '#3c3c3c',
            borderRight: 0
        },
    }),
);

const MenuTab = () => {
    const appContext = useContext(AppContext)
    const { t } = useTranslation("translation")
    // handle tab color of menu tabs
    const tabs = []
    routes.map(route => {
        tabs.push({
            key: route.key,
            path: route.path
        })

        if (route.subRoutes.length > 0) {
            route.subRoutes.map(subRoute => {
                tabs.push({
                    key: subRoute.key,
                    path: subRoute.path
                })
            })
        }
    })
    const tabClickStateInit = {}
    tabs.map(tab => {
        if (window.location.pathname === tab.path || window.location.pathname.includes(`${tab.path}/`)) {
            if (!window.location.href.includes('?key')) {
                tabClickStateInit[tab.key] = true
            } else {
                if (window.location.href.includes(tab.key)) {
                    tabClickStateInit[tab.key] = true
                } else {
                    tabClickStateInit[tab.key] = false
                }
            }           
        } else {
            tabClickStateInit[tab.key] = false
        }
    })

    const [tabKeyState, setTabKeyState] = useState(tabClickStateInit)

    // handle click tab and sub tab of menu tabs
    const navigate = useNavigate()
    const handleClickMenu = (route) => {
        if (route.subRoutes.length > 0) {
            let newMenus = []
            const menus = localStorage.getItem(LocalStorageKey.Open_Sub_Menu_Keys)
            if (menus && menus.split(',').length > 0) {
                newMenus = menus.split(',')                
            }
            if (!newMenus.includes(route.key)) {            
                newMenus.push(route.key)
            } else {
                newMenus = newMenus.filter(value => value !== route.key)
            }
            localStorage.setItem(LocalStorageKey.Open_Sub_Menu_Keys, newMenus.join(','))
        } else {
            if (route.path === ROUTE_PATH.LOGIN) {
                // Logout
                appContext.setIsLogin(false)
                localStorage.clear()
            }

            navigate(route.path)
        }
        handleSetTabKeyState(route)
    }

    const handleClickSubMenu = (subRoute) => {     
        navigate(subRoute.path)
        handleSetTabKeyState(subRoute)
    }

    // set color state when click tab and sub tab
    const handleSetTabKeyState = (routeClicked) => {
        const newKeyState = {}
        Object.keys(tabKeyState).map(key => {
            if (routeClicked.key === key) {
                newKeyState[key] = true
            } else {
                if (key.includes(routeClicked.key)) {
                    newKeyState[key] = tabKeyState[key]
                } else if (routeClicked.key.includes(key)) {
                    newKeyState[key] = true
                } else {
                    newKeyState[key] = false
                }
            }
        })
        setTabKeyState(newKeyState)
    }

    return (
        <div className='menu-tab-container'>
            <StyledEngineProvider injectFirst>
                <Drawer variant="permanent" open={true}>
                    <List component="nav" sx={{marginTop: '15px'}}>
                        {routes.map(route => {
                            return (
                                <>
                                    <ListItemButton
                                        sx={{
                                            margin: '0 15px', 
                                            borderRadius: '5px',
                                        }}
                                        className={tabKeyState[route.key] && 'menutab-tab-item-btn-click'} 
                                        onClick={() => handleClickMenu(route)}
                                    >
                                        <ListItemIcon 
                                            sx={{minWidth: '35px', color: tabKeyState[route.key] ? '#ffffff' : '#3c3c3c'}}
                                        >
                                            {route.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={t(route.name)} classes={{primary: 'menu-tab-list-item-text-primary'}} />
                                        {route.subRoutes.length > 0 && (
                                            <>{localStorage.getItem(LocalStorageKey.Open_Sub_Menu_Keys)?.includes(route.key) ? <ExpandLess /> : <ExpandMore />}</>
                                        )}
                                    </ListItemButton>
                                    {route.subRoutes.length > 0 && (
                                        <Collapse in={localStorage.getItem(LocalStorageKey.Open_Sub_Menu_Keys)?.includes(route.key)} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {route.subRoutes.map(subRoute => {
                                                    return (
                                                        <ListItemButton
                                                            sx={{margin: '0 15px', borderRadius: '5px'}}
                                                            className={tabKeyState[subRoute.key] && 'menutab-subtab-item-btn-click'} 
                                                            onClick={() => handleClickSubMenu(subRoute)}
                                                        >
                                                            <ListItemIcon 
                                                                sx={{marginLeft: '20px', minWidth: '35px', color: tabKeyState[subRoute.key] ? '#3678cf' : '#3c3c3c'}}
                                                            >
                                                                {subRoute.icon}
                                                            </ListItemIcon>
                                                            <ListItemText primary={t(subRoute.name)} classes={{primary: 'menu-tab-list-item-text-primary'}}/>
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
        </div>
    )
}

export default MenuTab;