import { 
    Box, Breadcrumbs, Button, FormControl, InputLabel, MenuItem, 
    Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, 
    TableHead, TablePagination, TableRow, TextField, Typography 
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CircleIcon from '@mui/icons-material/Circle';
import PageviewIcon from '@mui/icons-material/Pageview';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import { reportStatus } from '../../../../utils/constant';
import { Modal } from 'react-bootstrap';
import * as api from '../../../../api/api.js';
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { removeVietnameseAccent } from '../../../../utils/helper.js';
import { LANGUAGE_TYPE } from '../../../../i18n/type.js';
import { CustomToastId, LocalStorageKey } from '../../../../utils/constant';
import { toast } from 'react-toastify'; 
import './ReviewReport.scss';


const ReviewReport = () => {
    const { t } = useTranslation("translation")
    const [farms, setFarms] = useState([])
    const [farmSelect, setFarmSelect] = useState(0)
    const [houses, setHouses] = useState([])
    const [houseSelect, setHouseSelect] = useState(0)
    const [statusSelect, setStatusSelect] = useState('All')
    const [dateSelect, setDateSelect] = useState(dayjs(moment().format('YYYY-MM-DD')))

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [totalData, setTotalData] = useState(0)
    const [dataRows, setDataRows] = useState([])
    const [reportReview, setReportReview] = useState({})
    const [reviewStatus, setReviewStatus] = useState('')
    const [submit, setSubmit] = useState(false)
    const [refreshTable, setRefreshTable] = useState(false)

    const statuses = [
        { statusId: 'All', statusName: t('dropdown_status_all') },
        { statusId: reportStatus.Pending, statusName: t('report_status.pending') },
        { statusId: reportStatus.Approve, statusName: t('report_status.approve') },
        { statusId: reportStatus.Reject, statusName: t('report_status.reject') }
    ]

    const [showPopup, setShowPopup] = useState(false)

    const handleChangeFarmSelect = (event) => {
        setFarmSelect(event.target.value)
    }

    const handleChangeHouseSelect = (event) => {
        setHouseSelect(event.target.value)
    }

    const handleChangeStatusSelect = (event) => {
        setStatusSelect(event.target.value)
    }

    const handleChangeDateSelect = (value) => {
        setDateSelect(value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const handleClosePopup = () => {
        setShowPopup(false)
    }

    const handleClickViewReportDetail = (report) => {
        let farm = farms.find(x => Number(x.farmId) === Number(farmSelect))
        let house = houses.find(x => Number(x.houseId) === Number(houseSelect))

        setReportReview({
            ...report, 
            farmName: farm?.farmName ? (i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)) : '',
            houseName: house?.houseNumber ? `${t('dropdown_house_label')} ${house.houseNumber}` : ''
        })
        setShowPopup(true)
    }

    const handleReview = (reportStatus) => {
        setReviewStatus(reportStatus)
        setSubmit(true)
    }

    useEffect(() => {
        const fetchMasterDataFarm = async function() {
            const resultApi = await api.getMasterDataFarms()
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setFarms(resultApi.data.data)
                setFarmSelect(resultApi.data.data[0]?.farmId || 0)
            }
        }

        fetchMasterDataFarm()
    }, [])

    useEffect(() => {
        const fetchMasterDataHouse = async function() {
            const resultApi = await api.getMasterDataHouses(farmSelect)
            if (resultApi && resultApi.data && resultApi.data.code === 0) {
                setHouses(resultApi.data.data)
                setHouseSelect(resultApi.data.data[0]?.houseId || 0)
            }
        }

        fetchMasterDataHouse()
    }, [farmSelect])

    useEffect(() => {
        const fetchData = async function() {
            const result = await api.searchReport({
                page, 
                size: rowsPerPage, 
                farmId: farmSelect,
                houseId: houseSelect,
                reportDate: dayjs(dateSelect).format('DD-MM-YYYY'),
                status: statusSelect
            })

            if (result && result.data && result.data.data) {
                setDataRows(result.data?.data?.data || [])
                setTotalData(result.data?.data?.total || 0)
            }
        }
        fetchData()
    }, [houseSelect, statusSelect, dateSelect, page, rowsPerPage, refreshTable])

    useEffect(() => {
        if (submit) {
            const postData = async () => {
                if (toast.isActive(CustomToastId.ReviewReport)) {
                    toast.update(CustomToastId.ReviewReport, { render: t('notify.processing'), isLoading: true })
                } else {
                    toast.loading(t('notify.processing'), { toastId: CustomToastId.ReviewReport })
                }
    
                try {
                    const resultApi = await api.submitReviewReport({
                        reportId: Number(reportReview.reportId || 0),
                        reportStatus: reviewStatus,
                        reviewerId: Number(localStorage.getItem(LocalStorageKey.User_Id) || 0)
                    })
                    if (resultApi && resultApi.data && resultApi.data.code === 0) {
                        setRefreshTable(prev => !prev)
                        toast.update(CustomToastId.ReviewReport, { render: t('notify.review_report_success'), type: "success", isLoading: false, autoClose: 2000 })
                    } else {
                        toast.update(CustomToastId.ReviewReport, { render: t('notify.review_report_fail'), type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch(e) {
                    toast.update(CustomToastId.ReviewReport, { render: t('notify.review_report_fail'), type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
                handleClosePopup()
            }
            postData()
        }
    }, [submit])

    return (
        <div>
            <div className='review-report-tab-container-0'>
                <div>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <Typography color='gray' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report')}</Typography>
                        <Typography color='text.primary' sx={{fontSize: '24px', fontWeight: '600'}}>{t('menu_report_review')}</Typography>
                    </Breadcrumbs>
                </div>
                <div className='d-flex flex-row align-items-center mt-1'>
                    <FormControl fullWidth classes={{root: 'review-report-tab-container-0-1-form-control-root'}}>
                        <InputLabel>{t('dropdown_farm_label')}</InputLabel>
                        <Select value={farmSelect} label={t('dropdown_farm_label')} onChange={handleChangeFarmSelect}>
                            {farms.map(farm => (
                                <MenuItem value={farm.farmId}>
                                    {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? farm.farmName : removeVietnameseAccent(farm.farmName)}
                                </MenuItem>
                            ))} 
                        </Select>
                    </FormControl>
                    <FormControl fullWidth classes={{root: 'review-report-tab-container-0-1-form-control-root'}} sx={{marginLeft: 2}}>
                        <InputLabel>{t('dropdown_house_label')}</InputLabel>
                        <Select value={houseSelect} label={t('dropdown_house_label')} onChange={handleChangeHouseSelect}>
                            {houses.map(house => (
                                <MenuItem value={house.houseId}>
                                    {`${t('dropdown_house_label')} ${house.houseNumber}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth classes={{root: 'review-report-tab-container-0-1-form-control-root'}} sx={{marginLeft: 2}}>
                        <InputLabel>{t('dropdown_status')}</InputLabel>
                        <Select value={statusSelect} label={t('dropdown_status')} onChange={handleChangeStatusSelect}>
                            {statuses.map(status => (
                                <MenuItem value={status.statusId}>{status.statusName}</MenuItem>
                            ))} 
                        </Select>
                    </FormControl>
                    <div className='review-report-tab-container-0-1-datepicker'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} >
                                <DemoItem>
                                    <DatePicker label={t('date_picker_choose_date')} format='DD-MM-YYYY'
                                        value={dateSelect}
                                        onChange={(newValue) => handleChangeDateSelect(newValue)}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                </div>
                <Paper elevation={2} sx={{borderRadius: '10px'}}>
                    <div className='review-report-tab-container-0-2'>
                        <Stack direction='row' alignItems='center' marginBottom={2}>
                            <ReviewsIcon fontSize='large' sx={{color: '#0C4DA0', marginRight: '12px'}} />
                            <Typography sx={{fontSize: '24px', fontWeight: '600'}}>{t('review_report_title')}</Typography>
                        </Stack>
                        <Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center' className='output-report-detail-table-header'>{t('review_report_table.serial')}</TableCell>
                                            <TableCell align='left' className='output-report-detail-table-header'>{t('review_report_table.created_user')}</TableCell>
                                            <TableCell align='left' className='output-report-detail-table-header'>{t('review_report_table.created_time')}</TableCell>
                                            <TableCell align='left' className='output-report-detail-table-header'>{t('review_report_table.reviewed_user')}</TableCell>
                                            <TableCell align='left' className='output-report-detail-table-header'>{t('review_report_table.reviewed_time')}</TableCell>
                                            <TableCell align='left' className='output-report-detail-table-header'>{t('review_report_table.status')}</TableCell>
                                            <TableCell align='center' className='output-report-detail-table-header'>{t('review_report_table.view_detail')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {dataRows.map((row, index) => (
                                        <TableRow>
                                            <TableCell align='center'>{index + 1}</TableCell>
                                            <TableCell align='left'>
                                                {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? row.creator : removeVietnameseAccent(row.creator)}
                                            </TableCell>
                                            <TableCell align='left'>{row.createdDate}</TableCell>
                                            <TableCell align='left'>
                                                {i18n.language === LANGUAGE_TYPE.VIETNAMESE ? row.reviewer : removeVietnameseAccent(row.reviewer)}
                                            </TableCell>
                                            <TableCell align='left'>{row.reviewedDate}</TableCell>
                                            <TableCell align='left'>
                                                <Stack direction='row'>
                                                    <CircleIcon sx={{
                                                            width: '8px', 
                                                            color: row.reportStatus === reportStatus.Approve ? '#17b040' : (row.reportStatus === reportStatus.Pending ? '#f0ce24' : '#c40502'), 
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    <Typography sx={{fontSize: '14px'}}>
                                                        {row.reportStatus === reportStatus.Approve ? t('report_status.approve') : 
                                                        row.reportStatus === reportStatus.Reject ? t('report_status.reject') : t('report_status.pending')}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Button variant='contained' 
                                                    startIcon={<PageviewIcon fontSize='small' />}
                                                    classes={{root: 'review-report-tab-container-0-1-btn-root'}}
                                                    sx={{ width: '100px', minWidth: '100px', height: '35px', fontSize: '13px' }}
                                                    onClick={() => handleClickViewReportDetail(row)}
                                                >
                                                    {t('button.detail_title')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[50, 100, 200]}
                                labelRowsPerPage={`${t('records_per_page')}:`}
                                labelDisplayedRows={({ from, to, count }) => { return `${from}-${to} ${t('of')} ${count}`}}
                                component='div'
                                count={totalData}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    </div>
                </Paper>
            </div>
            <Modal 
                centered size='lg'
                className='review-report-tab-popup-modal' 
                backdropClassName='review-report-tab-popup-backdrop-modal'
                show={showPopup} onHide={handleClosePopup}
            >
                <Modal.Header closeButton>
                    <Modal.Title className='review-report-tab-popup-title'>
                        {t('popup_title.review_report')}
                        <span className='review-report-tab-popup-title-status'>
                            {`(${reportReview.reportStatus === reportStatus.Approve ? t('report_status.approve') : 
                                reportReview.reportStatus === reportStatus.Reject ? t('report_status.reject') : t('report_status.pending')})`}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Box padding={1}>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label='Farm' value={reportReview.farmName} fullWidth />
                            <TextField variant='outlined' label={t('dropdown_house_label')} value={reportReview.houseName} fullWidth />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.number_of_dead_rooster')} fullWidth 
                                value={reportReview.roosterDie || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_eliminated_rooster')} fullWidth 
                                value={reportReview.roosterRemove || 0} 
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.number_of_dead_hen')} fullWidth 
                                value={reportReview.henDie || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_eliminated_hen')} fullWidth 
                                value={reportReview.henRemove || 0} 
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={4}>
                            <TextField variant='outlined' label={t('report.amount_of_rooster_food')} fullWidth 
                                value={reportReview.roosterFeedMass || 0} 
                            />
                            <TextField variant='outlined' label={t('report.amount_of_hen_food')} fullWidth 
                                value={reportReview.henFeedMass || 0} 
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={2}>
                            <TextField variant='outlined' label={t('report.total_eggs')} fullWidth 
                                value={reportReview.totalEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_incubated_eggs')} fullWidth 
                                value={reportReview.selectEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_big_eggs')} fullWidth 
                                value={reportReview.overSizeEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_small_eggs')} fullWidth 
                                value={reportReview.underSizeEgg || 0} 
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} marginBottom={4}>
                            <TextField variant='outlined' label={t('report.number_of_malformed_eggs')} fullWidth 
                                value={reportReview.deformedEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_dirty_eggs')} fullWidth 
                                value={reportReview.dirtyEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_beaten_eggs')} fullWidth 
                                value={reportReview.beatenEgg || 0} 
                            />
                            <TextField variant='outlined' label={t('report.number_of_broken_eggs')} fullWidth 
                                value={reportReview.brokenEgg || 0} 
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} justifyContent='flex-end' 
                            sx={{display: reportReview.reportStatus === reportStatus.Pending ? 'flex' : 'none'}}
                        >
                            <Button 
                                variant='contained' 
                                sx={{height: '32px', width: '100px', textTransform: 'none', backgroundColor: '#0C4DA0'}}
                                onClick={() => handleReview(reportStatus.Approve)}
                            >
                                {t('button.approve_title')}
                            </Button>
                            <Button 
                                variant='outlined' 
                                sx={{height: '32px', width: '100px', textTransform: 'none', color: '#0C4DA0'}}
                                onClick={() => handleReview(reportStatus.Reject)}
                            >  
                                {t('button.reject_title')}
                            </Button>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2} justifyContent='flex-end'
                            sx={{display: reportReview.reportStatus === reportStatus.Pending ? 'none' : 'flex'}}
                        >
                            <Button 
                                variant='contained' 
                                sx={{height: '32px', width: '100px', textTransform: 'none', backgroundColor: '#0C4DA0'}}
                                onClick={handleClosePopup}
                            >
                                {t('button.close')}
                            </Button>
                        </Stack>
                    </Box>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReviewReport;