import { useEffect, useState } from "react";
import { getDidUserVote } from "../../../backend/postService";

import "../styles/posts.css";

export default function useCountedRates(id) {
	const [vote, setVote] = useState(null);
	const onSuccess = (vote) => {
		setVote(vote.rate);
	};

	const onErrors = () => {
		setVote(null);
	};

	useEffect(() => {
		getDidUserVote(id, onSuccess, onErrors);
	}, [id]);

	return { vote, setVote };
}
