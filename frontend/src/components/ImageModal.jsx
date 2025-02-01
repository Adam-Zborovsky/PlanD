import React from "react";
import { Modal } from "react-bootstrap";

function ImageModal({ show, onHide, imageUrl }) {
	return (
		<Modal
			show={show}
			onHide={onHide}
			centered
			contentClassName="bg-transparent border-0"
			style={{ background: "rgba(0, 0, 0, 0.8)" }}
		>
			<Modal.Body className="d-flex justify-content-center align-items-center p-0">
				<img
					src={imageUrl}
					alt="Profile"
					className="rounded-circle"
					style={{
						maxWidth: "300px",
						maxHeight: "300px",
						width: "auto",
						height: "auto",
						objectFit: "cover",
					}}
				/>
			</Modal.Body>
		</Modal>
	);
}

export default ImageModal;
