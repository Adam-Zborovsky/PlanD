import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import { toast } from "react-toastify";
import { getIdeas, addIdea } from "../Services/ideaService";
import { useParams } from "react-router-dom";
import { TiPlus } from "react-icons/ti";


function ViewDate() {
    const { isAuthenticated } = useContext(AuthContext);
    const [ideas, setIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState("");
    const { date } = useParams();

    useEffect(() => {
        getIdeas(date)
            .then((res) => {
                setIdeas(res.data);
            })
            .catch((err) => toast.error(err.response.data));
    }, [date]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return {
            originalDate: isoString,
            weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
            dayMonth: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        };
    };

    const handleAddIdea = () => {
        if (!newIdea.trim()) {
            toast.error("Idea cannot be empty!");
            return;
        }
        addIdea(date, { content: newIdea })
            .then((res) => {
                setIdeas((prevIdeas) => [...prevIdeas, res.data]);
                setNewIdea("");
                toast.success("Idea added successfully!");
            })
            .catch((err) => toast.error(err.response.data));
    };

    const formattedDate = formatDate(date);

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="container d-flex flex-column align-items-center" style={{ height: "100vh", marginTop: "10vh", gap: "5vh" }}>
            <div
                className="text-center p-3"
                style={{
                    backgroundColor: "var(--color-surface)",
                    borderRadius: "10px",
                    color: "var(--color-primary)",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                }}
            >
                <h3>
                    {formattedDate.weekday} {formattedDate.dayMonth}
                </h3>
            </div>

            <div className="w-100">
                <div className="d-flex flex-wrap gap-3">
                    {ideas.map((idea, index) => (
                        <div
                            key={index}
                            className="card p-3"
                            style={{
                                backgroundColor: "var(--color-surface)",
                                color: "var(--color-text)",
                                borderRadius: "10px",
                                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                                maxWidth: "75vw",
                            }}
                        >
                            <h5 className="card-title">{idea.content}</h5>
                            <p className="card-text text-muted">Suggested by: {idea.user}</p>
                            <button
                                className="btn btn-outline-primary w-100"
                                style={{ borderRadius: "10px" }}
                            >
                                Vote
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div >
                <button
                    className="btn btn-outline-primary"
                    style={{ borderRadius: "10px" }}
                    onClick={handleAddIdea}
                >
                    <TiPlus size={25} />
                </button></div>
        </div>
    );
}

export default ViewDate;
