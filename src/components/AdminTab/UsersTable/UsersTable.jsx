import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import * as api from '../../../api/api';
import moment from 'moment';
import { toast } from 'react-toastify';
import { CustomToastId, LocalStorageKey } from '../../../utils/constant';
import { DeleteUserForm, UpdateUserForm } from './index';
import './UsersTable.scss';

const columns = [
    { id: 'checkbox', label: '', minWidth: 60 },
    { id: 'edit', label: 'Sửa', minWidth: 80 },
    { id: 'name', label: 'Họ tên', minWidth: 120 },
    { id: 'farm', label: 'Farm', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'role', label: 'Vai trò', minWidth: 140, format: (value) => value.toFixed(2) },
    { id: 'address', label: 'Địa chỉ', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'dateOfBirth', label: 'Ngày sinh', minWidth: 110, format: (value) => value.toFixed(2) },
    { id: 'email', label: 'Email', minWidth: 150, format: (value) => value.toFixed(2) },
    { id: 'phone', label: 'SĐT ', minWidth: 120, format: (value) => value.toFixed(2) },
    
];

const UsersTable = (props) => {
    const { valueSearch, submitChange, addUser } = props
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(3);
    const [rows, setRows] = useState([]);
    const [tableHeight, setTableHeight] = useState(window.innerHeight * 2 / 3)
    const [checkAll, setCheckAll] = useState(false)
    const [userIdsDelete, setUserIdsDelete] = useState([])
    const [displayDeleteButton, setDisplayDeleteButton] = useState('none')
    const [showFormDelete, setShowFormDelete] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [showFormUpdate, setShowFormUpdate] = useState(false)
    const [userUpdate, setUserUpdate] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const currentUser = Number(localStorage.getItem(LocalStorageKey.User_Id))

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleTickCheckAll = (event) => {
        setCheckAll(event.target.checked)
        setRows(rows.map(row => {
            if (row.userId !== currentUser) {
                row.checked = event.target.checked
            }
            
            return row
        }))

        if (event.target.checked) {
            setUserIdsDelete(rows.filter(row => row.userId !== currentUser).map(row => row.userId))
            setDisplayDeleteButton('flex')
        } else {
            setUserIdsDelete([])
            setDisplayDeleteButton('none')
        }
    }

    const handleTickCheck = (valueCheck, userId) => {
        let userIds = userIdsDelete
        if (!valueCheck) {
            setCheckAll(false)
            userIds.pop(userId)
            setUserIdsDelete(userIds)
        } else {
            userIds.push(userId)
            setUserIdsDelete(userIds)
        }

        setRows(rows.map(row => {
            if (row.userId == userId) {
                row.checked = valueCheck
            }
            return row
        }))

        if (userIds.length === rows.length) {
            setCheckAll(true)
        }
        if (userIds.length > 0) {
            setDisplayDeleteButton('flex')
        } else {
            setDisplayDeleteButton('none')
        }
    }

    const handleClickDeleteButton = () => {
        setShowFormDelete(true)
    }

    const handleClickUpdateButton = (user) => {
        setShowFormUpdate(true)
        setUserUpdate(user)
    }

    window.addEventListener('resize', () => {
        setTableHeight(window.innerHeight * 2 / 3)
    })

    useEffect(() => {
        const fetchData = async () => {
            if (toast.isActive(CustomToastId.AddminUserTable)) {
                toast.update(CustomToastId.AddminUserTable, { render: "Đang tải dữ liệu ...", isLoading: true })
            } else {
                toast.loading("Đang tải dữ liệu ...", { toastId: CustomToastId.AddminUserTable })
            }

            try {
                const resultApi = await api.searchUsers(page, rowsPerPage, valueSearch)
                if (resultApi && resultApi.data && resultApi.data.data) {
                    const dataApi = resultApi.data.data
                    setTotalData(dataApi.total || 0)
                    const dataTable = dataApi.data.map(record => {
                        return {
                            userId: record?.User_Id,
                            name: record?.Full_Name || '',
                            farm: record?.Farm || '',
                            role: record?.Role || '',
                            address: record?.Address || '',
                            dateOfBirth: record?.Date_Of_Birth ? moment(record?.Date_Of_Birth).format('DD-MM-YYYY') : '',
                            email: record?.Email || '',
                            phone: record?.Phone_Number || '',
                            checked: false
                        }
                    })
                    setRows(dataTable)
                    toast.update(CustomToastId.AddminUserTable, { render: "Tải dữ liệu thành công", type: "success", isLoading: false, autoClose: 2000 })
                } else {
                    toast.update(CustomToastId.AddminUserTable, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 3000 })
                }
            } catch (e) {
                toast.update(CustomToastId.AddminUserTable, { render: "Tải dữ liệu thất bại", type: "error", isLoading: false, autoClose: 3000 })
            }
        }

        fetchData()
    }, [page, rowsPerPage, submitChange, addUser, deleteSuccess, updateSuccess])

    return (
        <div className='user-table-container'>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Stack direction='row' spacing={2} alignItems='center' marginTop={2} marginLeft={2} display={displayDeleteButton}>
                    <Typography variant='inherit'>Đã chọn <strong>{userIdsDelete.length} user</strong></Typography>
                    <Button variant="contained" size='small' onClick={handleClickDeleteButton}>Xóa</Button>
                </Stack>
                <TableContainer sx={{ maxHeight: tableHeight }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.id === 'edit' ? 'center' : 'left'} style={{ minWidth: column.minWidth }}>
                                    {column.id === 'checkbox' ? <Checkbox checked={checkAll} onChange={handleTickCheckAll}/> : column.label }
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} sx={row.userId === currentUser && {backgroundColor: '#f7f7f7'}}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align='left' style={{ fontWeight: 'normal' }}>
                                            {column.id === 'checkbox' ? <Checkbox checked = {row.checked} disabled={row.userId === currentUser} onChange={(event) => handleTickCheck(event.target.checked, row.userId)}/> :
                                            column.id === 'edit' ? <IconButton className='user-table-edit-button' onClick={() => handleClickUpdateButton(row)}><EditIcon /></IconButton>:
                                            column.format && typeof value === 'number' ? column.format(value) : value
                                            }
                                        </TableCell>
                                    )
                                })}
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[20, 30, 50]}
                    labelRowsPerPage="Số bản ghi mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => { return `${from}-${to} của ${count}`}}
                    component="div"
                    count={totalData}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <UpdateUserForm 
                showFormUpdate={showFormUpdate} setShowFormUpdate={setShowFormUpdate}
                updateSuccess={updateSuccess} setUpdateSuccess={setUpdateSuccess}
                user={userUpdate}
            />
            <DeleteUserForm 
                showFormDelete={showFormDelete} setShowFormDelete={setShowFormDelete}
                setDisplayDeleteButton={setDisplayDeleteButton}
                deleteSuccess={deleteSuccess} setDeleteSuccess={setDeleteSuccess}
                userIds={userIdsDelete}
            />
        </div>
    )
}

export default UsersTable;