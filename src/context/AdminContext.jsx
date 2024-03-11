import { createContext, useState } from 'react';

const AdminContext = createContext();

const AdminProvider = ({children}) => {
    const [openAddUserPopup, setOpenAddUserPopup] = useState(false)
    const [openEditUserPopup, setEditUserPopup] = useState(false)
    const [openAddFarmPopup, setOpenAddFarmPopup] = useState(false)
    const [openEditFarmPopup, setEditFarmPopup] = useState(false)

    const value = {
        openAddUserPopup, setOpenAddUserPopup,
        openEditUserPopup, setEditUserPopup,
        openAddFarmPopup, setOpenAddFarmPopup,
        openEditFarmPopup, setEditFarmPopup
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminContext, AdminProvider }