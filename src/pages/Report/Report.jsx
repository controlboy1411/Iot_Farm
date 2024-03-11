import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Header, MenuTab, ReportTab } from '../../components';
import './Report.scss';

const Report = () => {

    return (
        <div>
            <ThemeProvider theme={createTheme()}>
                <Box sx={{ display: 'flex' }}>
                    <MenuTab />
                    <Box component="main" sx={{ 
                        backgroundColor: 'white',
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                    >
                        <div className='main-report'>
                            <Header />
                            <ReportTab />
                        </div>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default Report;