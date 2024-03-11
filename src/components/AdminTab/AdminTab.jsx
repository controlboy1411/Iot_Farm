import { AddUserForm, UsersTable } from './index';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { StyledEngineProvider } from '@mui/material/styles';
import { useState } from 'react';
import './AdminTab.scss';

const AdminTab = () => {
    const [responsiveType, setResponsiveType] = useState(window.innerWidth >= 820 ? 1 : 2)
    const [showForm, setShowForm] = useState(false)
    const [valueSearch, setValueSearch] = useState('')
    const [submitChange, setSubmitChange] = useState(false)
    const [addUser, setAddUser] = useState(false)

    const handleSubmitSearch = () => {
        setSubmitChange(!submitChange)
    }

    const handleTypeEnter = (event) => {
        if (event.key === 'Enter') {
            setSubmitChange(!submitChange)
        }
    }

    window.addEventListener('resize', () => {
        setResponsiveType(window.innerWidth >= 820 ? 1 : 2)
    })

    return (
        <>
            <div className='mt-2'>
                <StyledEngineProvider injectFirst>
                    {responsiveType === 1 ?
                    <div className='row d-flex flex-row mt-2 mb-3 admin-tool-bar'>
                        <div className='col d-flex flex-row justify-content-start' style={{marginLeft: '20px'}}>
                            <TextField id="outlined-search" label="Search" type="search" value={valueSearch} onKeyDown={handleTypeEnter} onChange={(event) => setValueSearch(event.target.value)}/>
                            <div className='d-flex align-items-center justify-content-center admin-search-button' onClick={handleSubmitSearch}>
                                <SearchIcon />
                            </div>
                        </div>
                        <div className='col d-flex justify-content-end justify-content-end' style={{marginRight: '20px'}}>
                            <Button variant="contained" onClick={() => setShowForm(true)} >Tạo mới user</Button>
                        </div>
                    </div> :
                    <div className='d-flex flex-column mt-2 mb-3'>
                        <div className='d-flex justify-content-center mb-3'>
                            <Button variant="contained" onClick={() => setShowForm(true)} >Tạo mới user</Button>
                        </div>
                        <div className='d-flex flex-row justify-content-center'>
                            <TextField id="outlined-search" label="Search" type="search" />
                            <div className='d-flex align-items-center justify-content-center admin-search-button'>
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                    }
                    <UsersTable valueSearch={valueSearch} submitChange={submitChange} addUser={addUser}/>
                    <AddUserForm showForm={showForm} setShowForm={setShowForm} addUser={addUser} setAddUser={setAddUser}/>
                </StyledEngineProvider>
            </div>
        </>
    )
}

export default AdminTab;