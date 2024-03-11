import { Header, Footer, FarmAdministrationTab, AboutUs, MenuTab } from '../../../components';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import { AdminProvider } from '../../../../context/AdminContext';
import { useTranslation } from "react-i18next";
import './FarmAdministration.scss';

const FarmAdministration = () => {
    const [showAboutUs, setShowAboutUs] = useState(false)
    const { t } = useTranslation("translation")

    return (
        <div class='layout-container'>
            <header>
                <Header />
            </header>
            <div class='layout-content'>
                <div class='layout-menu-tab'>
                    <MenuTab />
                </div>
                <div class='layout-main-component'>
                    <AdminProvider>
                        <FarmAdministrationTab />
                    </AdminProvider>
                </div>
                <div className='about-us-container' onClick={() => setShowAboutUs(true)}>
                    <InfoOutlinedIcon sx={{ color: '#074E9F' }} />
                    <span className='about-us-title'>{t('about_us_title')}</span>
                </div>
            </div>
            <footer>
                <Footer />
            </footer>
            <AboutUs showAboutUs={showAboutUs} setShowAboutUs={setShowAboutUs} />
        </div>
    )
}

export default FarmAdministration;