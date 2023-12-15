import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@material-tailwind/react";
import { NextUIProvider } from "@nextui-org/react";

import { HashRouter as Router } from "react-router-dom"; // Importa HashRouter en lugar de BrowserRouter
import "./index.css";
import { LogginProvider } from "./modules/app/context/loginContext";
import registerServiceWorker from "./registerServiceWorker";

import { App } from "./modules/app";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<NextUIProvider>
		<ThemeProvider>
			<LogginProvider>
				<Router>
					<App />
				</Router>
			</LogginProvider>
		</ThemeProvider>
	</NextUIProvider>,
);

registerServiceWorker();
