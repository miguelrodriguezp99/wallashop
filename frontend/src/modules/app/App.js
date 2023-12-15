import Home from "./Home";
import LoginSite from "./LoginSite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Navbarc from "./components/Navbarc";
import PostDetails from "./components/PostDetails";
import RegisterSite from "./RegisterSite";

const App = () => {
	return (
		<>
			<Toaster position="bottom-center" richColors />
			<Navbarc />
			<Routes>
				<Route path="/*" element={<Home />} />
				<Route path="/wallashop/" element={<Home />} />
				<Route path="/wallashop/login" element={<LoginSite />} />
				<Route path="/wallashop/register" element={<RegisterSite />} />
				<Route path="/wallashop/post/:id" element={<PostDetails />} />
			</Routes>
		</>
	);
};

export default App;
