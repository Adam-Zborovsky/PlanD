import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChangeContext } from "../context/ChangeContext";
import { getAllUsers, getUser } from "../Services/userService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

function AllFriends() {
	const { userData } = useContext(AuthContext);
	const { changed } = useContext(ChangeContext);
	const [users, setUsers] = useState([]);
	const [userDates, setUserDates] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		getUser(userData._id)
			.then((res) => setUserDates(res.data.dates || []))
			.catch((err) => console.log(err.response.data));

		getAllUsers()
			.then((res) => setUsers(res.data))
			.catch((err) => console.log(err.response.data));
	}, [userData._id, changed]);

	return (
		<div className="container mt-4">
			{userDates.length > 0 ? (
				<table
					className="table table-borderless"
					style={{
						marginTop: "10vh",
						"--bs-table-color": "var(--color-text)",
						"--bs-table-bg": "var(--color-surface)",
						"--bs-table-border-color": "var(--color-border)",
						border: "1px solid var(--color-border, #cccccc)",
						borderRadius: "10px",
						borderCollapse: "separate",
					}}
				>
					<thead>
						<tr style={{ backgroundColor: "var(--color-bg)" }}>
							<th>Date</th>
							<th>Who Else is Home?</th>
						</tr>
					</thead>
					<tbody>
						{userDates.map((date) => {
							const usersHomeOnDate = users.filter((user) =>
								user.dates.includes(date)
							);

							return (
								<tr key={date}>
									<td>{date}</td>
									<td>
										<button
											className="btn btn-sm"
											style={{
												backgroundColor: "var(--color-primary)",
												color: "var(--color-text)",
												borderRadius: "5px",
												padding: "5px 10px",
											}}
											onClick={() =>
												setSelectedDate(selectedDate === date ? null : date)
											}
										>
											{selectedDate === date ? (
												<FaChevronUp />
											) : (
												<FaChevronDown />
											)}{" "}
											See Users
										</button>

										{selectedDate === date && (
											<ul
												className="list-unstyled mt-2"
												style={{
													backgroundColor: "var(--color-surface)",
													padding: "10px",
													borderRadius: "5px",
												}}
											>
												{usersHomeOnDate.length > 0 ? (
													usersHomeOnDate.map((user) => (
														<li
															key={user._id}
															className="d-flex align-items-center mb-2"
														>
															<img
																src={`${process.env.REACT_APP_API_URL}${user.image.path}`}
																alt={user.image.alt}
																width="35"
																height="35"
																className="rounded-circle me-2"
																style={{
																	border: "2px solid var(--color-border)",
																}}
															/>
															<span style={{ color: "var(--color-text)" }}>
																{user.name.first} {user.name.last}
															</span>
														</li>
													))
												) : (
													<li className="text-warning">
														No other users are home on this date.
													</li>
												)}
											</ul>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<div
					className="container d-flex flex-column align-items-center"
					style={{ marginTop: "10vh" }}
				>
					<h1>Add a date to see your friends!</h1>
					<Link to="/">Go to Home</Link>
				</div>
			)}
		</div>
	);
}

export default AllFriends;
