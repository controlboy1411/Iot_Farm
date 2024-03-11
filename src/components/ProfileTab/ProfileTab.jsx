import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { InformationTab, PasswordTab } from './index';
import { CustomTabPanel } from '../shared';
import './ProfileTab.scss';


const ProfileTab = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Thông tin cá nhân"/>
                    <Tab label="Đổi mật khẩu"/>
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0} p={3}>
                <InformationTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1} p={3}>
                <PasswordTab />
            </CustomTabPanel>
        </Box>
    );
}

export default ProfileTab;