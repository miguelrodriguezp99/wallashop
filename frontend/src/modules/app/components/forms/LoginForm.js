import { Button } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../../../../backend/userService.js";
import { config } from "../../../../config/constants.js";
import { LogginContext } from "../../context/loginContext.js";
import Input from "../inputs/LoginInput.js";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { setToken, setImage, setUser } = useContext(LogginContext);

	const navigate = useNavigate();

	//CAMBIAR TODA ESTA LOGICA A OTRO SITIO -----------------------------
	const onSuccess = (authenticatedUser) => {
		setImage(authenticatedUser.user.avatar);
		setToken(authenticatedUser.serviceToken);
		setUser(authenticatedUser.user);

		toast.success("Logeado correctamente.");
		localStorage.setItem(
			config.SERVICE_TOKEN_NAME,
			`Bearer ${authenticatedUser.serviceToken}`,
		);
		localStorage.setItem("user", JSON.stringify(authenticatedUser.user));
		localStorage.setItem("avatar", authenticatedUser.user.avatar);
		navigate("/wallashop/");
	};

	const onErrors = (error) => {
		toast.error("Error al logearse.");
	};

	const reauthenticateUser = () => {
		console.log(
			"Se requiere reautenticación. Mostrar cuadro de diálogo de inicio de sesión.",
		);
	};
	// ------------------------------------------------------------------

	const handleSubmit = () => {
		login(username, password, onSuccess, onErrors, reauthenticateUser);
	};

	return (
		<>
			<div className="flex items-center justify-center overflow-hidden h-[calc(100vh-65px)]">
				<div className="border border-solid border-gray-200 rounded-2xl text-center text-gray-200 font-helvetica py-10 px-16 w-300 mb-80 bg-black mt-60 overflow-hidden hover:border-blue-300">
					<h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
						LOG IN
					</h1>
					<form onSubmit={() => handleSubmit()}>
						<label>
							<Input
								type="text"
								name="username"
								value={username}
								placeholder={"Username"}
								fn={setUsername}
							/>
						</label>
						<label>
							<Input
								label="Password"
								name="password"
								type={"password"}
								value={password}
								placeholder={"Password"}
								fn={setPassword}
							/>
						</label>
						<div className="form-buttons">
							<Button
								className="text-white ml-2 mr-2"
								onPress={() => handleSubmit()}
								as={Button}
								color="primary"
								href="#"
								variant="ghost"
							>
								Log in
							</Button>

							<Button
								className="text-white ml-2 mr-2"
								onPress={() => navigate("/wallashop/home")}
								as={Button}
								color="primary"
								href="#"
								variant="ghost"
							>
								Home
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
