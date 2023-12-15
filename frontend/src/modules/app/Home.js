import React, { useContext, useEffect } from "react";
import { config } from "../../config/constants.js";
import { LogginContext } from "./context/loginContext.js";
import "./styles/home.css";
import { Filters } from "./components/Filters.js";
import Posts from "./components/Posts.js";
import CreatePostModal from "./components/modals/CreatePostModal.js";
import useStomp from "./hooks/useStomp.js";
import NotificationsReload from "./components/NotificationsReload.js";

export default function Home() {
	let { token, setToken, setUser } = useContext(LogginContext);

	useEffect(() => {
		const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
		const user = localStorage.getItem("user");
		if (bearer !== null) {
			setToken(bearer);
			setUser(JSON.parse(user));
		}
	}, [setToken, setUser]);

	const { isNotified } = useStomp(token);

	return (
		<>
			{ 
			isNotified === true 
			? 
				<NotificationsReload />
			: 
				null
				}
			<div className="home" >
				<div className="content">
					<h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
						Our Articles
					</h1>
					<Filters />
					<div className="posts-container">
						<Posts />
						{token != null ? <CreatePostModal /> : null}
					</div>
				</div>
			</div>
		</>
	);
}
