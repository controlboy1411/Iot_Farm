import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from '../shared';
import { useQueryParams } from '../../hook';
import { DataTable, StatusBar, TitleBar, ListLineChart, FormActiveHouse, ListChartView } from './index.js';

const DashboardDetails = (props) => {
	const { houseId } = props
	const [showForm, setShowForm] = useState(false)
	const [table, setTable] = useState({
		loading: false,
		error: false,
		data: [],
	});
	const [pageSize, setPageSize] = useState(50);
	const [week, setWeek] = useState(9);

	const [showTable, setShowTable] = useState(window.innerWidth > 500 ? true : false)
	window.addEventListener('resize', () => {
		setShowTable(window.innerWidth > 500 ? true : false)
	})

	// filters state
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const formRef = useRef(null);

	const queryParams = useQueryParams()
	const farmId = queryParams?.farm_id || 0

	const handleReset = () => {
		formRef.current.reset();
		setStartDate(null);
		setEndDate(null);
	};

	const handleOptionSelect = (option) => {
		setPageSize(option)
	}

	return (
		<>
			<div className='d-flex justify-content-center'>
				<TitleBar houseID={houseId} setShowForm={setShowForm}/>
			</div>
			<StatusBar houseId={houseId} week={week} />
			<ListChartView houseId={houseId} />
			{/* <ListLineChart houseId={houseId} /> */}
			<div>
				{showTable && (
					<div className="border">
						<Form ref={formRef} className="d-flex flex-column flex-sm-row align-items-center gap-2 w-100 w-md-75 p-4 position-realtive justify-content-between">
							<div className='d-flex align-items-center'>
								<div className="w-100">
									<DatePicker setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} />
								</div>
								<div className="vr d-none d-md-block" style={{ margin: "5px" }} />
								<div className="w-50 cursor-pointer mt-md-0" onClick={handleReset}>
									Xóa bộ lọc
								</div>
							</div>
							<div className='d-flex align-items-center'>
								<span style={{ textAlign: 'right', width: '8.5rem', marginRight: '8px' }}>
									Bản ghi mỗi trang:
								</span>
								<Dropdown>
									<Dropdown.Toggle variant='success' id='dropdown-basic'>
										{pageSize}
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<Dropdown.Item onClick={() => { handleOptionSelect(20) }}>20 bản ghi</Dropdown.Item>
										<Dropdown.Item onClick={() => { handleOptionSelect(50) }}>50 bản ghi</Dropdown.Item>
										<Dropdown.Item onClick={() => { handleOptionSelect(100) }}>100 bản ghi</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</Form>
		
						<DataTable houseId={houseId} startDate={startDate} endDate={endDate} table={table} setTable={setTable} pageSize={pageSize} />
					</div>
				)}
			</div>
			<FormActiveHouse farmId={farmId} houseId={houseId} showForm={showForm} setShowForm={setShowForm}/>
		</>
	);
};

export default DashboardDetails;
