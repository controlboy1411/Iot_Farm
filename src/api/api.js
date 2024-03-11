import axios from 'axios';
import moment from 'moment';
import { DefaultPassword } from '../config/app.config';
import { LocalStorageKey } from '../utils/constant';

const API = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/dashboard-api`,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getListHouse = async function(farmId) {
	const result = await API.get('/home/list-house', {
		params: { farmId }
	})
	return result
}

export const getDataTable = async function(houseId, page, size, startDate, endDate) {
	const result = await API.get('/dashboard/data-table', {
		params: { 
			houseId, 
			page, 
			size, 
			startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '', 
			endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : ''
		}
	})

	return result
}

export const getActiveHouses = async function(farmId) {
	const result = await API.get('/home/active-houses', {
		params: { farmId }
	})
	return result
}

export const getTransferPageInfor = async function(currentHouseId) {
	const result = await API.get('/dashboard/transfer-page', {
		params: {
			houseId: currentHouseId
		}
	})

	return result
}

export const getStatusBarData = async function(houseId) {
	const result = await API.get('/dashboard/status-bar-data', {
		params: { houseId }
	})

	return result
}

export const getLineChartData = async function(houseId, timeLines, distance) {
	const headers = {
		"Content-type": "application/json; charset=UTF-8"
	}
	const result = await API.post('/dashboard/line-chart-data', { houseId, timeLines, distance }, { headers })
	return result
}

export const getLineChartDataV2 = async function(houseId, selectedDate) {
	const headers = {
		"Content-type": "application/json; charset=UTF-8"
	}
	const result = await API.post('/dashboard/line-chart-data-v2', { houseId, selectedDate }, { headers })
	return result
}

export const activeHouse = async function(farmId, houseId, roostersNum, hensNum, chickenBatch, weekNo) {
	const result = await API.post('/home/active', {
		farmId, houseId, roostersNum, hensNum, chickenBatch, weekNo
	})
	return result
}

export const getHouseInfor = async function(houseId) {
	const result = await API.get('/dashboard/house-infor', {
		params: { houseId }
	})
	return result
}


export const register = async function(data) {
	const result = await API.post('/auth/register', {
		farmId: data.farm.id,  
		roleId: data.role.id, 
		fullName: data.fullName, 
		dateOfBirth: data.dateOfBirth, 
		email: data.email, 
		phoneNumber: data.phone, 
		address: data.address, 
		userName: data.email, 
		password: DefaultPassword,
		creatorId: localStorage.getItem(LocalStorageKey.User_Id || 0)
	})
	return result
}

export const registerV2 = async function(data) {
	const result = await API.post('/auth/register-v2', {
		username: data.username,
		password: data.password,
		farmIds: data.farmIds,
		roleId: data.roleId,
		status: data.status,
		fullName: data.fullName,
		dateOfBirth: data.dateOfBirth,
		gender: data.gender,
		email: data.email,
		phoneNumber: data.phoneNumber,
		address: data.address
	})
	return result
}

export const login = async function({ username, password }) {
	const result = await API.post('/auth/login', {
		username: username || '',
		password: password || ''
	})
	return result
}

export const changePassword = async function(userName, currentPassword, newPassword) {
	const result = await API.post('/auth/change-password', {
		userName, currentPassword, newPassword
	})
	return result
}

export const resetPassword = async function(userId, newPassword) {
	const result = await API.post('/auth/reset-password', { userId, newPassword })
	return result
}

export const getUserInfor = async function(userId) {
	const result = await API.get('/user/user-infor', {
		params: { userId }
	})
	return result
}

export const searchUsers = async function(page, size, search) {
	const result = await API.get('/user/search', {
		params: { page, size, search }
	})
	return result
}

export const searchUsersV2 = async function(page, size, farmId) {
	const result = await API.get('/user/search-v2', {
		params: { page, size, farmId }
	})
	return result
}

export const updateUserInfor = async function(data) {
	const result = await API.post('/user/update', {
		User_Id: data?.User_Id || 0,
		Full_Name: data?.Full_Name || null,
		Address: data?.Address || null,
		Date_Of_Birth: data?.Date_Of_Birth || null,
		Phone_Number: data?.Phone_Number || null,
		Email: data?.Email || null,
		Farm_Id: data?.Farm_Id || null,
		Role_Id: data?.Role_Id || null
	})
	return result
}

export const deleteUsers = async function(userIds) {
	const result = await API.post('/user/delete', { userIds })
	return result
}

export const searchHouses = async function(page, size, farmId, status) {
	const result = await API.get('/home/search', {
		params: { page, size, farmId, status }
	})
	return result
}

export const getMasterDataFarms = async function() {
	const result = await API.get('/master/farms')
	return result
}

export const getMasterDataHouses = async function(farmId) {
	const result = await API.get('/master/active-houses', {
		params: { farmId }
	})
	return result
}

export const getSummaryDataReport = async function(houseId, fromDate, toDate) {
	const result = await API.get('/report/summary-data', {
		params: { houseId, fromDate, toDate }
	})
	return result
}

export const getUserInforV2 = async function(userId) {
	const result = await API.get('/user/user-infor-v2', {
		params: { userId }
	})
	return result
}

export const updateUserInforV2 = async function(data) {
	const result = await API.post('/user/update-v2', data)
	return result
}

export const addHouse = async function({ farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status }) {
	const result = await API.post('/farm/add-house', { farmId, houseNumber, roosterNumber: Number(roosterNumber), henNumber: Number(henNumber), batchNo, weekAge: Number(weekAge), status })
	return result
}

export const updateHouse = async function({ farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status }) {
	const result = await API.post('/farm/update-house', { farmId, houseNumber, roosterNumber: Number(roosterNumber), henNumber: Number(henNumber), batchNo, weekAge: Number(weekAge), status })
	return result
}

export const deleteHouse = async function({ farmId, houseNumber }) {
	const result = await API.post('/farm/delete-house', { farmId, houseNumber })
	return result
}

export const getFarmInfor = async function(farmId) {
	const result = await API.get('/farm/infor', {
		params: { farmId }
	})
	return result
}

export const saveReport = async function({ farmId, houseId, roosterDie, henDie, roosterRemove, henRemove, roosterFeedMass, henFeedMass, 
	totalEgg, selectEgg, overSizeEgg, underSizeEgg, deformedEgg, dirtyEgg, beatenEgg, brokenEgg, creatorId }) 
{
	const result = await API.post('/report/daily-livestock/import', { 
		farmId, houseId, roosterDie, henDie, roosterRemove, henRemove, roosterFeedMass, henFeedMass, 
        totalEgg, selectEgg, overSizeEgg, underSizeEgg, deformedEgg, dirtyEgg, beatenEgg, brokenEgg, creatorId
	 })
	return result
}

export const searchReport = async function({page, size, farmId, houseId, reportDate, status}) {
	const result = await API.get('/report/daily-livestock/list', {
		params: { page, size, farmId, houseId, reportDate, status }			// reportDate: 'DD-MM-YYYY'
	})
	return result
}

export const submitReviewReport = async function({ reportId, reportStatus, reviewerId }) 
{
	const result = await API.post('/report/daily-livestock/review', { 
		reportId, reportStatus, reviewerId
	 })
	return result
}