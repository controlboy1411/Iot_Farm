import * as React from 'react';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { Drawer as MuiDrawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Collapse, StyledEngineProvider, Stack } from '@mui/material';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ROUTE_PATH, routes } from '../../../config/routes.config';
import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from '../../../context/AppContext';
import { LocalStorageKey } from '../../../utils/constant';
import logoHeader01 from '../../../assets/logo_header_01.png';
import logoHeader02 from '../../../assets/logo_header_02.jpg';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AboutUs from '../AboutUs/AboutUs';
import './MenuTabMobile.scss';

const drawerWidth = 280;
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '0%',
    transform: 'translate(0%, -50%)',
    width: drawerWidth,
    bgcolor: 'background.paper',
    borderWidth: 0,
    boxShadow: 24,
    height: '100vh'
};

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
            background: 'white',
            color: '#3c3c3c'
        },
    }),
);

const MenuTabMobile = () => {
    const appContext = useContext(AppContext)
    const [showAboutUs, setShowAboutUs] = useState(false)
    const { t } = useTranslation("translation")

    const handleClose = () => appContext.setOpenMenuTabMobile(false)

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

            handleClose()
            navigate(route.path)
        }
        handleSetTabKeyState(route)
    }

    const handleClickSubMenu = (subRoute) => {
        handleClose()    
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
        <Modal 
            open={appContext.openMenuTabMobile} onClose={handleClose} 
            aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
            className='menu-tab-mobile-popup'
        >
            <Box sx={modalStyle}>
                <div className='menu-tab-mobile-margin-top'></div>
                <Stack direction='row' justifyContent='center' alignItems='center' padding={1}>
                    <img src={logoHeader01} alt="logo_01" className='menu-tab-mobile-logo-img-01'/>
                    <img src={logoHeader02} alt="logo_02" className='menu-tab-mobile-logo-img-02'/>
                    <span className='menu-tab-mobile-title'>IOT FARM</span>
                </Stack>
                <StyledEngineProvider injectFirst>
                    <Drawer variant="permanent" open={appContext.openMenuTabMobile}>
                        <List component="nav" sx={{marginTop: '15px'}}>
                            {routes.map(route => {
                                return (
                                    <>
                                        <ListItemButton
                                            sx={{margin: '0 15px', borderRadius: '5px'}}
                                            className={tabKeyState[route.key] && 'menutab-tab-item-btn-click'} 
                                            onClick={() => handleClickMenu(route)}
                                        >
                                            <ListItemIcon 
                                                sx={{minWidth: '40px', color: tabKeyState[route.key] ? '#ffffff' : '#3c3c3c', marginLeft: '5px'}}
                                            >
                                                {route.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={t(route.name)} sx={{display: !appContext.openMenuTabMobile && 'none'}}/>
                                            {route.subRoutes.length > 0 && appContext.openMenuTabMobile && (
                                                <>{localStorage.getItem(LocalStorageKey.Open_Sub_Menu_Keys)?.includes(route.key) ? <ExpandLess /> : <ExpandMore />}</>
                                            )}
                                        </ListItemButton>
                                        {route.subRoutes.length > 0 && (
                                            <Collapse in={localStorage.getItem(LocalStorageKey.Open_Sub_Menu_Keys)?.includes(route.key)} timeout='auto' unmountOnExit>
                                                <List component='div' disablePadding>
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
                <div className='menutab-mobile-about-us-container' onClick={() => setShowAboutUs(true)}>
                    <InfoOutlinedIcon sx={{ color: '#074E9F' }} />
                    <span className='menutab-mobile-about-us-title'>{t('about_us_title')}</span>
                </div>
                <AboutUs showAboutUs={showAboutUs} setShowAboutUs={setShowAboutUs} />
            </Box>
        </Modal>
    )
}

export default MenuTabMobile;