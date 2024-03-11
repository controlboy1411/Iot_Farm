import logoHeader01 from '../../../assets/logo_header_01.png';
import logoHeader02 from '../../../assets/logo_header_02.jpg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ReactCountryFlag from "react-country-flag";
import i18n from 'i18next';
import { LANGUAGE_TYPE } from '../../../i18n/type';
import { LocalStorageKey } from '../../../utils/constant';
import { IconButton } from '@mui/material';
import { removeVietnameseAccent } from '../../../utils/helper';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import MenuTabMobile from '../MenuTabMobile/MenuTabMobile';
import { ROUTE_PATH } from '../../../config/routes.config';
import './Header.scss';

const Header = (props) => {
    const { login } = props
    const userName = localStorage.getItem(LocalStorageKey.User_Name)
    const fullName = localStorage.getItem(LocalStorageKey.Full_Name)

    const appContext = useContext(AppContext)
    const navigate = useNavigate()
    
    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang)
    }

    const onClickOpenMenu = () => {
        appContext.setOpenMenuTabMobile(prev => !prev)
    }

    const handleGoToHomePage = () => {
        if (login !== false && userName && fullName) {
            navigate(ROUTE_PATH.HOME)
        }
    }

    return (
        <div className='header-container'>
            <div className='d-flex flex-row row'>
                <div className='col d-flex flex-row align-items-center justify-content-start'>
                    {login !== false && userName && fullName && (
                        <div className='header-container-1-menu'>
                            <IconButton onClick={onClickOpenMenu}>
                                <MenuIcon />
                            </IconButton>
                        </div>
                    )}
                    {login === false && (
                        <>
                            <img src={logoHeader01} alt="logo_01" className='header-container-1-logo-img-01-not-login'/>
                            <img src={logoHeader02} alt="logo_02" className='header-container-1-logo-img-02-not-login'/>
                            <span className='header-container-1-title-not-login'>IOT FARM</span>
                        </>
                    )}
                    <img src={logoHeader01} alt="logo_01" className='header-container-1-logo-img-01' onClick={handleGoToHomePage}/>
                    <img src={logoHeader02} alt="logo_02" className='header-container-1-logo-img-02' onClick={handleGoToHomePage}/>
                    <span className='header-container-1-title'>IOT FARM</span>
                </div>
                <div className='col d-flex flex-row align-items-center justify-content-end'>
                    {login !== false && userName && fullName && (
                        <div className='header-container-2-sub-1'>
                            <AccountCircleIcon sx={{marginRight: '5px'}}/>
                            <span className='header-container-2-sub-1-username'>
                                {`${i18n.language === LANGUAGE_TYPE.VIETNAMESE ? fullName : removeVietnameseAccent(fullName)} (${userName})`}
                            </span>
                        </div>
                    )}
                    <div className='d-flex flex-row align-items-center header-container-2-sub-2'>
                        <IconButton size='small'
                            sx={{ marginRight: '5px' }}
                            className={i18n.language === LANGUAGE_TYPE.VIETNAMESE ? 'header-lang-btn-choosed' : ''}
                            onClick={() => handleChangeLanguage(LANGUAGE_TYPE.VIETNAMESE)}
                        >
                            <ReactCountryFlag countryCode="VN" svg className='header-container-2-sub-2-flag' />
                        </IconButton>
                        <IconButton size='small'
                            className={i18n.language === LANGUAGE_TYPE.ENGLISH ? 'header-lang-btn-choosed' : ''}
                            onClick={() => handleChangeLanguage(LANGUAGE_TYPE.ENGLISH)}
                        >
                            <ReactCountryFlag countryCode="US" svg className='header-container-2-sub-2-flag' />
                        </IconButton>
                    </div>
                </div>
            </div>
            {login !== false && userName && fullName && (
                <div className='header-container-3'>
                    <AccountCircleIcon sx={{ marginRight: '5px' }} />
                    <span className='header-container-2-sub-1-username'>
                        {`${i18n.language === LANGUAGE_TYPE.VIETNAMESE ? fullName : removeVietnameseAccent(fullName)} (${userName})`}
                    </span>
                </div>
            )}
            <MenuTabMobile />
        </div>
    )
}

export default Header;