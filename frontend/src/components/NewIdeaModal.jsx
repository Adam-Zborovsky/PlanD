import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function CalenderModal({ showModal, setShowModal }) {
	const { userData } = useContext(AuthContext);
	const [ideaContent, setIdeaContent] = useState("");

	const handleClose = () => {
		setShowModal(false);
	};

	const handleIdeaChange = (e) => {
		setIdeaContent(e.target.value);
	};

	const saveIdea = () => {};

	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			centered
			dialogClassName="custom-calendar"
		>
			<Modal.Header closeButton>
				<Modal.Title>What is your Idea?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="form-group">
						<label htmlFor="ideaInput" className="form-label">
							Share your idea:
						</label>
						<textarea
							id="ideaInput"
							className="form-control"
							rows="5"
							value={ideaContent}
							onChange={handleIdeaChange}
							placeholder="Write your idea here..."
						></textarea>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-secondary" onClick={handleClose}>
					Close
				</button>
				<button className="btn btn-primary" onClick={saveIdea}>
					Add Idea
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default CalenderModal;
