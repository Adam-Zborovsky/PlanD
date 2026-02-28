import { createContext, useState } from "react";

export const ChangeContext = createContext();

export const ChangeProvider = ({ children }) => {
	const [changed, setChanged] = useState(false);

	const change = () => {
		setChanged(!changed);
	};

	return (
		<ChangeContext.Provider value={{ changed, change }}>
			{children}
		</ChangeContext.Provider>
	);
};
