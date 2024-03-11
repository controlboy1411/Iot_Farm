import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ setStartDate, setEndDate, startDate, endDate }) => {
	return (
		<div style={{width: '200px'}}>
			<ReactDatePicker
				selectsRange={true}
				startDate={startDate}
				endDate={endDate}
				onChange={(update) => {
					setStartDate(update[0]);
					setEndDate(update[1]);
				}}
				className="p-1 rounded-2 border-1 datePicker w-100"
				placeholderText="Lọc theo ngày"
				withPortal
			/>
		</div>
	);
};

export default DatePicker;
