import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../context/AuthContext";
import { ChangeContext } from "../context/ChangeContext";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { addIdea, updateIdea } from "../Services/ideaService";

function IdeaModal({ showModal, setShowModal, initialIdea }) {
	const { userData } = useContext(AuthContext);
	const { change } = useContext(ChangeContext);
	const [ideaContent, setIdeaContent] = useState(initialIdea.content);
	const { date } = useParams();
	const [isEditing, setIsEditing] = useState(!!initialIdea.content);

	useEffect(() => {
		setIdeaContent(initialIdea?.content || "");
		setIsEditing(!!initialIdea?.content);
	}, [initialIdea]);

	const handleClose = () => setShowModal(false);

	const handleIdeaChange = (e) => {
		setIdeaContent(e.target.value);
	};

	const handleSubmit = () => {
		if (!isEditing) {
			addIdea(userData._id, {
				date: date,
				content: ideaContent,
			})
				.then((res) => {
					toast.success("Idea added successfully");
					setShowModal(false);
					change();
				})
				.catch((err) => toast.error(err.response?.data));
		} else {
			updateIdea(initialIdea._id, { content: ideaContent })
				.then((res) => {
					toast.success("Idea updated successfully");
					setShowModal(false);
					change();
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<Modal
			show={showModal}
			onHide={handleClose}
			centered
			dialogClassName="custom-calendar"
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{isEditing ? "Edit Your Idea" : "What Is Your Idea?"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="form-group">
						<label htmlFor="ideaInput" className="form-label">
							{isEditing ? "Edit your idea:" : "Share your idea:"}
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
				<button
					className="btn btn-primary"
					onClick={handleSubmit}
					disabled={ideaContent === ""}
				>
					{isEditing ? "Save Changes" : "Add Idea"}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default IdeaModal;
