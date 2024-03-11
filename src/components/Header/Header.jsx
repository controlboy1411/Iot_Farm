import { default as BootstrapNavbar } from 'react-bootstrap/Navbar';
import moment from 'moment/moment.js';
import 'moment/locale/vi';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import MenuTabMobile from '../MenuTabMobile/MenuTabMobile.jsx';
import { LocalStorageKey } from '../../utils/constant.js';
import './Header.scss';

function Header() {
	moment.locale('vi')
	const momentFormat = 'llll:ss'
	const getContent = () => {
		const hour = moment().hours()
		return (hour >= 0 && hour < 12) ? 'Chào buổi sáng' : (hour >= 12 && hour < 18) ? 'Chào buổi chiều' : 'Chào buổi tối'
	}

	let time = moment().format(momentFormat)
	const [currentTime, setCurrentTime] = useState(time)
	const [content, setContent] = useState(getContent())
	const userName = localStorage.getItem(LocalStorageKey.User_Name)

	setInterval(() => {
		let time = moment().format(momentFormat)
		setCurrentTime(time)
		setContent(getContent())
	}, 1000)

	return (
		<>
			<BootstrapNavbar collapseOnSelect expand="md" bg="light" variant="light" sticky="top" className="w-100 d-flex row" style={{ zIndex: "10", marginLeft: 0 }}>
				<div className='col header-menu-button'>
					<MenuTabMobile />
				</div>
				<div className='col d-flex justify-content-start'>
					<BootstrapNavbar.Brand className="d-flex align-items-center justify-content-center">
						<span className="mx-3 text-muted d-none d-md-inline">
							{content}
						</span>
						<span className="text-muted d-none d-md-inline">
							{currentTime}
						</span>
					</BootstrapNavbar.Brand>
				</div>
				<div className='col d-flex justify-content-end'>
					<PersonIcon className='header-user-icon'/>
					<span className='text-muted header-username'>{userName}</span>
				</div>
			</BootstrapNavbar>
		</>
	);
}

export default Header;
