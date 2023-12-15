import { Button } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUp } from "../../../../backend/userService.js";
import { config } from "../../../../config/constants.js";
import { LogginContext } from "../../context/loginContext.js";
import { uploadFile } from "../../firebase/config.js";
import Input from "../inputs/LoginInput.js";

const RegisterForm = () => {
	const avatarUrl = "https://random.imagecdn.app/500/500";
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastname] = useState("");
	const [isVisible, setIsVisible] = React.useState(false);
	const [avatar, setAvatar] = useState(avatarUrl);
	const { setImage } = useContext(LogginContext);
	const toggleVisibility = () => setIsVisible(!isVisible);

	function getParams() {
		const formData = {
			userName,
			password,
			firstName,
			lastName,
			email,
			avatar,
		};
		return formData;
	}

	const onSuccess = () => {
		setImage(avatar);
		console.log("he llegado al onSuccess");
		toast.success("User created successfully");
		navigate("/wallashop/login");
	};

	const onErrors = (error) => {
		toast.error("Error al crear el usuario.");
		console.log(error);
	};

	const reauthenticateUser = () => {
		console.log(
			"Se requiere reautenticación. Mostrar cuadro de diálogo de inicio de sesión.",
		);
	};

	const handleSubmit = () => {
		const user = getParams();
		signUp(user, onSuccess, onErrors, reauthenticateUser);
	};

	const handleSubmitAvatar = async (files) => {
		const avatar = files[0];
		console.log("avatar: " + avatar);
		const result = await uploadFile(avatar);
		const fullPath = result.metadata.fullPath;
		const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROYECT}.appspot.com/o/${fullPath}?alt=media`;
		localStorage.setItem("avatar", route);
		console.log("route: " + route);
		setAvatar(route);
	};

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen bg-black">
				<div className="border border-solid border-gray-200 rounded-2xl text-center text-gray-200 font-helvetica py-10 px-16 w-500 mt-0 hover:border-blue-300">
					<h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
						SIGN UP
					</h1>
					<form onSubmit={() => handleSubmit()}>
						<label htmlFor="username">
							<Input
								id="username"
								type="text"
								name="username"
								value={userName}
								placeholder={"Username"}
								fn={setUserName}
							/>
						</label>
						<label htmlFor="email">
							<Input
								id="email"
								type="text"
								name="email"
								value={email}
								placeholder={"Email"}
								fn={setEmail}
							/>
						</label>
						<label htmlFor="password">
							<Input
								id = "password"
								label="Password"
								name="password"
								value={password}
								placeholder={"Password"}
								fn={setPassword}
								endContent={
									<button
										className="focus:outline-none"
										type="button"
										onClick={toggleVisibility}
									></button>
								}
								type={isVisible ? "text" : "password"}
								className="max-w-xs"
							/>
						</label>
						<label htmlFor="firstname">
							<Input
								id="firstname"
								type="text"
								name="firstName"
								value={firstName}
								placeholder={"FirstName"}
								fn={setFirstName}
							/>
						</label>
						<label htmlFor="lastname">
							<Input
								id="lastname"
								type="text"
								name="lastname"
								value={lastName}
								placeholder={"LastName"}
								fn={setLastname}
							/>
						</label>
						<label
							htmlFor="formFile"
							className="mt-0 inline-block dark:text-neutral-200 text-white"
						>
							Avatar
						</label>
						<input
							className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary mt-5"
							type="file"
							id="formFile"
							onChange={(e) => {
								handleSubmitAvatar(e.target.files);
							}}
						/>

						<div className="form-buttons mt-5">
							<Button
								className="text-white ml-2 mr-2"
								onPress={() => handleSubmit()}
								as={Button}
								color="primary"
								href="#"
								variant="ghost"
							>
								Sign Up
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

export default RegisterForm;
