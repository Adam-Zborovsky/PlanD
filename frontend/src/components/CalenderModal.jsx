import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalenderModal.css";
import { AuthContext } from "../context/AuthContext";
import { addDate } from "../Services/dateService";

function CalenderModal({ setIsHome, showModal, setShowModal }) {
	const [selectedDates, setSelectedDates] = useState([]);
	const { userData } = useContext(AuthContext);

	const getDatesInRange = (startDate, endDate) => {
		const date = new Date(startDate.getTime());
		const dates = [];

		while (date <= endDate) {
			dates.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return dates;
	};

	const handleDateChange = (date) => {
		if (Array.isArray(date)) {
			const [startDate, endDate] = date;
			setSelectedDates(getDatesInRange(startDate, endDate));
		} else {
			setSelectedDates([date]);
		}
	};

	const handleClose = () => {
		setShowModal(false);
	};

	const saveDates = () => {
		selectedDates.forEach((date) => {
			addDate(userData._id, new Date(date).toISOString())
				.then((res) => console.log(res))
				.catch((err) => console.log(err));
		});

		setShowModal(false);
		setIsHome(true);
	};

	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			centered
			className="custom-calendar"
		>
			<Modal.Header closeButton>
				<Modal.Title>Select Your Home Dates</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Calendar onChange={handleDateChange} selectRange locale="en-US" />
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
