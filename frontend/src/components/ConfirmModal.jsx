function ConfirmModal({
	action,
	title = "Confirm Action",
	message = "Are you sure?",
	isOpen,
	onClose,
}) {

	return (
		<div>
			{isOpen && (
				<div
					className="modal fade show d-block"
					tabIndex="-1"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
					onClick={onClose}
				>
					<div
						className="modal-dialog modal-dialog-centered"
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className="modal-content " style={{
								backgroundColor: "var(--color-surface)",
								color: "var(--color-text)",
								width: "80vw",
								margin: "0 auto"
							}}
						>
							<div className="modal-header">
								<h5 className="modal-title">{title}</h5>
								<button
									type="button"
									className="btn-close"
									onClick={onClose}
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body">
								<p>{message}</p>
							</div>
							<div className="modal-footer">
								<button className="btn btn-secondary" onClick={onClose}>
									Cancel
								</button>
								<button
									className="btn btn-danger"
									onClick={() => {
										action();
										onClose();
									}}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ConfirmModal;
