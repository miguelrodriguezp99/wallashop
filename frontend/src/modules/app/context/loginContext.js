import { createContext, useState } from "react";

// Este es el que tenemos que consumir
export const LogginContext = createContext();

// Este es el que nos provee de acceso al contexto
export function LogginProvider({ children }) {
	const [token, setToken] = useState(null);
	const [image, setImage] = useState(null);
	const [user, setUser] = useState({});

	return (
		<LogginContext.Provider
			value={{
				token,
				setToken,
				image,
				setImage,
				user,
				setUser,
			}}
		>
			{children}
		</LogginContext.Provider>
	);
}
