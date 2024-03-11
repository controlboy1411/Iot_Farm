import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Header, LoginForm, Footer } from '../../components';
import loginBackgroundImg from '../../../assets/background_login.jpg';
import './Login.scss';

const Login = () => {
    return (
        <ThemeProvider theme={createTheme()}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header login={false}/>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
                    <Box component="main" sx={{ backgroundColor: '#f1f1f1', flexGrow: 1 }}>
                        <img className='login-background-image' src={loginBackgroundImg} alt='Background_Image'/>
                        <LoginForm />
                    </Box>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    )
}

export default Login;