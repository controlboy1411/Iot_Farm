import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import * as api from '../../../api/api.js';
import { getPageShowForItem } from '../../../utils/helper.js';
import './DataTable.scss';

const DataTable = (props) => {
	const { houseId, table, setTable, startDate, endDate, pageSize } = props;
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [itemPagingNumber, setItemPagingNumber] = useState(1)
	const [render, setRender] = useState(false)

	setInterval(() => {
		setRender(!render)
	}, 1000 * 300) // 5 phut

	useEffect(() => {
		const fetchData = async () => {
			try {
				setTable({ loading: true, error: false, data: [] });
				const dataDashboard = await api.getDataTable(houseId, page, pageSize, startDate, endDate)
				setTable({ loading: false, error: false, data: dataDashboard.data.data.data });
				setTotalPage(dataDashboard.data.data.totalPage)
				setItemPagingNumber(Math.ceil(page / 3))
			} catch (error) {
				setTable((prev) => ({ ...prev, loading: false, error: true }));
				console.log(error.message);
			}
		};
		fetchData();
	}, [houseId, page, pageSize, startDate, endDate, render]);

	return (
		<>
			{table.loading ? (
				<Spinner animation="grow" variant="dark" />
			) : table.error ? (
				<Alert variant="danger"> Error while loading data </Alert>
			) : (
				<div className='m-2'>
					<Table bordered hover responsive className="mb-0">
						<thead>
							<tr>
								<th className='house-data-table-th'>STT</th>
								<th className='house-data-table-th'>Nhiệt độ<br/>(&deg;C)</th>
								<th className='house-data-table-th'>Độ ẩm<br/>(%)</th>
								<th className='house-data-table-th'>CO2<br/>(%)</th>
								<th className='house-data-table-th'>NH3<br/>(%)</th>
								<th className='house-data-table-th'>Gió<br/>(ft/m)</th>
								<th className='house-data-table-th'>Quạt<br/>(ON/OFF)</th>
								<th className='house-data-table-th'>Ánh sáng<br/>(Lux)</th>
								<th className='house-data-table-th'>Đèn<br/>(ON/OFF)</th>
								<th className='house-data-table-th'>Ngày & giờ</th>
							</tr>
						</thead>
						<tbody>
							{table.data &&
								table.data.map((item, idx) => (
									<tr key={idx}>
										<td className='house-data-table-td'>{idx+1 + (page-1)*pageSize}</td>
										<td className='house-data-table-td'>{item?.Temperature ? Number(item?.Temperature).toFixed(2) : "0.00"}</td>
										<td className='house-data-table-td'>{item?.Humidity ? Number(item?.Humidity).toFixed(2) : "0.00"}</td>
										<td className='house-data-table-td'>{item?.CO2 ? Number(item?.CO2).toFixed(3) : "0.000"}</td>
										<td className='house-data-table-td'>{item?.NH3 ? Number(item?.NH3).toFixed(3) : "0.000"}</td>
										<td className='house-data-table-td'>{item?.Wind_Speed ? (Number(item?.Wind_Speed) * 196.85).toFixed(2) : "0.00"}</td>
										<td className='house-data-table-td'>{item?.Wind_Status ? Number(item?.Wind_Speed) > 0 ? "ON" : "OFF" : ""}</td>
										<td className='house-data-table-td'>{item?.Light_Intensity ? Number(item?.Light_Intensity).toFixed(2) : "0.00"}</td>
										<td className='house-data-table-td'>{item?.Light_Status ? Number(item?.Light_Intensity) > 0 ? "ON" : "OFF" : ""}</td>
										<td className='house-data-table-td'>{item?.Measurement_Time?.toString()?.replace('T', ' ')?.replace('Z', ' ')?.slice(0, -5) || ""}</td>
									</tr>
								))}
						</tbody>
					</Table>
					<div className='d-flex justify-content-center bd-highlight mt-2'>
						<nav aria-label="Page navigation example">
							<ul className="pagination">
								<li className="page-item">
									<button className="page-link" onClick={() => {
											setPage(page-1 < 1 ? 1 : page-1)
										}}>&laquo;
									</button>
								</li>
								<li className="page-item" style={getPageShowForItem(1, page, totalPage) ? {display: 'block'} : {display: 'none'}}>
									<button className = {`${page % 3 === 1 ? "page-link active" : "page-link"}`} onClick={() => {
											setPage(1 + (itemPagingNumber - 1) * 3)
										}}>
										{getPageShowForItem(1, page, totalPage)}
									</button>
								</li>
								<li className="page-item" style={getPageShowForItem(2, page, totalPage) ? {display: 'block'} : {display: 'none'}}>
									<button className = {`${page % 3 === 2? "page-link active" : "page-link"}`} onClick={() => {
											setPage(2 + (itemPagingNumber - 1) * 3)
										}}>
										{getPageShowForItem(2, page, totalPage)}
									</button>
								</li>
								<li className="page-item" style={getPageShowForItem(3, page, totalPage) ? {display: 'block'} : {display: 'none'}}>
									<button className = {`${page % 3 === 0 ? "page-link active" : "page-link"}`} onClick={() => {
											setPage(3 + (itemPagingNumber - 1) * 3)
										}}>
										{getPageShowForItem(3, page, totalPage)}
									</button>
								</li>
								<li className="page-item">
									<button className="page-link" onClick={() => {
										setPage(page+1 > totalPage ? totalPage : page+1)
										}}>&raquo;
									</button>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			)}
		</>
	);
};

export default DataTable;
