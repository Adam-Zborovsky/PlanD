import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalenderModal.css";
import { ChangeContext } from "../context/ChangeContext";
import { AuthContext } from "../context/AuthContext";
import { addDate } from "../Services/dateService";
import { toast } from "react-toastify";

function CalenderModal({ showModal, setShowModal }) {
	const [selectedDates, setSelectedDates] = useState([]);
	const { userData } = useContext(AuthContext);
	const { change } = useContext(ChangeContext);

	const getDatesInRange = (startDate, endDate) => {
		const date = new Date(startDate.getTime());
		const dates = [];

		while (date <= endDate) {
			dates.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return dates;
	};

	const formatDate = (date) => {
		const options = {
			weekday: "long",
			day: "numeric",
			month: "short",
			year: "numeric",
		};
		return date.toLocaleDateString("en-GB", options);
	};

	const handleDateChange = (date) => {
		if (Array.isArray(date)) {
			const [startDate, endDate] = date;
			const dates = getDatesInRange(startDate, endDate).map(formatDate);
			setSelectedDates(dates);
		} else {
			setSelectedDates([formatDate(date)]);
		}
	};

	const handleClose = () => {
		setShowModal(false);
	};

	const saveDates = () => {
		selectedDates.forEach((date) => {
			addDate(userData._id, date)
				.then((res) => change())
				.catch((err) => toast.error(err.response?.data));
		});
		setShowModal(false);
	};
	const highlightWeekends = ({ date }) => {
		const day = date.getDay();
		if (day === 5 || day === 6) {
			return "weekend";
		}
		return "weekday";
	};
	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			centered
			dialogClassName="custom-calendar"
		>
			<Modal.Header closeButton>
				<Modal.Title>Select Your Home Dates</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Calendar
					onChange={handleDateChange}
					selectRange
					locale="en-US"
					tileClassName={highlightWeekends}
					navigationLabel={({ date, label }) => {
						return date.toLocaleDateString("en-US", { month: "short" });
					}}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-secondary" onClick={handleClose}>
					Close
				</button>
				<button className="btn btn-primary" onClick={saveDates}>
					Save Dates
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default CalenderModal;
