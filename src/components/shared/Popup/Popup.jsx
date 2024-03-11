import { Modal } from 'react-bootstrap';
import './Popup.scss';

const Popup = (props) => {
    const { title, body, footer, open, setOpen } = props

    return (
        <Modal centered animation className='popup-modal' backdropClassName='popup-backdrop-modal' show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title className='popup-title'>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            {footer !== null && footer !== undefined && (
                <Modal.Footer>
                    {footer}
                </Modal.Footer>
            )}
        </Modal>
    )
}

export default Popup