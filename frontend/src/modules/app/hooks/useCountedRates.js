import { useEffect, useState } from "react";
import { getNRates } from "../../../backend/postService";

import "../styles/posts.css";

export default function useCountedRates(id) {
	const [nrates, setNRates] = useState({});

	const onSuccessRates = (countedRates) => {
		setNRates(countedRates);
	};

	const onErrorsRates = () => {
		console.log("Error al obtener los rates.");
	};

	useEffect(() => {
		getNRates(id, onSuccessRates, onErrorsRates);
	}, [id]);

	return { nrates, setNRates };
}
