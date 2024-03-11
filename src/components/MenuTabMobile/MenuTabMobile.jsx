import * as React from 'react';
import { Box, Menu, MenuItem, List, IconButton, ListItemIcon, Collapse } from '@mui/material';
import { Menu as MenuIcon, ExpandLess, ExpandMore, Toc as TocIcon } from "@mui/icons-material";
import { routes } from '../../config/routes.config';
import { LocalStorageKey } from "../../utils/constant";
import { useState, useEffect } from 'react';
import { useQueryParams } from "../../hook";
import { useNavigate } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";
import * as api from "../../api/api";
import './MenuTabMobile.scss';

const MenuTabMobile = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const userId = localStorage.getItem(LocalStorageKey.User_Id)
    const userRole = localStorage.getItem(LocalStorageKey.User_Role)

    const [farmId, setFarmId] = useState(localStorage.getItem(LocalStorageKey.Farm_Id_Selected))

    const queryParams = useQueryParams()
    const [showMenuR2R3, setShowMenuR2R3] = useState(queryParams?.farm_id ? true : false)

    const routeKeys = routes.map(route => route.key)
    const subMenuStateInit = {}
    routeKeys.map(key => {
        subMenuStateInit[key] = false
    })
    const [subMenuState, setSubMenuState] = useState(subMenuStateInit)

    const navigate = useNavigate()
    const handleClickMenu = (event, route) => {
        if (route.key !== 'r3') {
            handleClose(event)
        }

        if (route.key === 'r2') {
            navigate(route.path + `?farm_id=${farmId}`)
        } else if (route.key === 'r3') {
            setSubMenuState({...subMenuState, [route.key]: !subMenuState[[route.key]]})
        } else if (route.key === 'r6') {
            localStorage.clear()
            navigate(route.path)
        } else {
            navigate(route.path)
        }
    }

    const handleClickSubMenu = (event, subRoute) => {
        handleClose(event)
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
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <IconButton size="small" onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Menu anchorEl={anchorEl} open={open}
                onClose={handleClose}
                 PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: window.innerWidth * 0.69,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {routes.map(route => {
                    return userId && route.roles.includes(Number(userRole)) && (
                        <div>
                            <MenuItem 
                                onClick={(event) => handleClickMenu(event, route)} 
                                sx={{width: window.innerWidth * 0.75, display: !checkDisplayMenu(route) && 'none'}}
                            >
                                <ListItemIcon>
                                    {route.icon}
                                </ListItemIcon>
                                <span>{route.name}</span>
                                {route.subRoutes.length > 0 && open && (
                                    <>{subMenuState[route.key] ? <ExpandLess sx={{marginLeft: '10px'}}/> : <ExpandMore sx={{marginLeft: '10px'}}/>}</>
                                )}
                            </MenuItem>
                            {route.subRoutes.length > 0 && (
                                <Collapse in={subMenuState[route.key]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {route.subRoutes.map(subRoute => {
                                            return (
                                                <MenuItem onClick={(event) => handleClickSubMenu(event, subRoute)}>
                                                    <ListItemIcon sx={{marginLeft: '15px'}}>
                                                        <TocIcon />
                                                    </ListItemIcon>
                                                    <span>{subRoute.name}</span>
                                                </MenuItem>
                                            )
                                        })}    
                                    </List>
                                </Collapse>
                            )}
                        </div>
                    )
                })}
            </Menu>
        </React.Fragment>
    )
}

export default MenuTabMobile;