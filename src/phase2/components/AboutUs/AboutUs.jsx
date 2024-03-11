import Modal from 'react-bootstrap/Modal';
import logoHeader from '../../../assets/logo_header_02.jpg';
import { useTranslation } from "react-i18next";
import './AboutUs.scss'

const AboutUs = (props) => {
    const { showAboutUs, setShowAboutUs } = props
    const { t } = useTranslation("translation")

    return (
        <Modal animation className='aboutus-modal' backdropClassName='aboutus-custom-backdrop-modal' 
            show={showAboutUs} onHide={() => setShowAboutUs(false)}
        >
            <Modal.Header closeButton className='aboutus-modal-header'>{t('about_us_title')}</Modal.Header>
            <Modal.Body>
                <div className='d-flex flex-row align-items-center aboutus-body-container'>
                    <img src={logoHeader} alt="logo" className='aboutus-body-container-1-img'/>
                    <div className='d-flex flex-column '>
                        <div className='aboutus-body-container-1-title-name-01'>AXONS Vietnam</div>
                        <div className='aboutus-body-container-1-title-name-02'>{t('about_us_permission')}</div>
                    </div>
                </div>
                <div className='aboutus-body-container'>
                    <table>
                        <tr>
                            <td className='aboutus-body-container-table-c1'>{t('about_us_application')}:</td>
                            <td className='aboutus-body-container-table-row-value'>{t('about_us_application_name')}</td>
                        </tr>
                        <tr>
                            <td className='aboutus-body-container-table-c1'>{t('about_us_version')}:</td>
                            <td className='aboutus-body-container-table-row-value'>1.0.0</td>
                        </tr>
                        <tr>
                            <td className='aboutus-body-container-table-c1'>{t('about_us_support')}:</td>
                            <td className='aboutus-body-container-table-row-value'>iservice.cp.com.vn</td>
                        </tr>
                    </table>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default AboutUs;