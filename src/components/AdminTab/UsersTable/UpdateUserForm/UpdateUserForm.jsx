import Modal from 'react-bootstrap/Modal';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomTabPanel } from '../../../shared';
import { useState } from 'react';
import EditUserTab from './EditUserTab/EditUserTab';
import ResetPasswordTab from './ResetPasswordTab/ResetPasswordTab';
import './UpdateUserForm.scss';

const UpdateUserForm = (props) => {
    const { showFormUpdate, setShowFormUpdate, updateSuccess, setUpdateSuccess, user } = props
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Modal show={showFormUpdate} animation onHide={() => setShowFormUpdate(false)} style={{zIndex: 2000}}>
                <Modal.Body>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="SỬA THÔNG TIN"/>
                                <Tab label="RESET MẬT KHẨU"/>
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0} paddingTop={3} paddingX={3} paddingBottom={1}>
                            <EditUserTab 
                                user={user} 
                                setShowFormUpdate={setShowFormUpdate} 
                                updateSuccess={updateSuccess} 
                                setUpdateSuccess={setUpdateSuccess}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1} paddingTop={3} paddingX={3} paddingBottom={1}>
                            <ResetPasswordTab 
                                user={user} 
                                setShowFormUpdate={setShowFormUpdate}
                            />
                        </CustomTabPanel>
                    </Box>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateUserForm;