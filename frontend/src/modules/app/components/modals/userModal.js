import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import {
	changeAvatar,
	changePassword,
	updateProfile,
} from "../../../../backend/userService.js";
import { config } from "../../../../config/constants.js";
import { LogginContext } from "../../context/loginContext.js";
import { uploadFile } from "../../firebase/config.js";
import "./../../styles/navbar.css";

export default function UserModal() {
	// ------ Context -----------------------------------------------
	const { user, image, setImage } = useContext(LogginContext);
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	// ------ User Information ----------------------------------------
	const [userFirstName, setUserFirstName] = useState(user?.firstName);
	const [userLastName, setUserLastName] = useState(user?.lastName);
	const [userEmail, setUserEmail] = useState(user?.email);

	// ------ User Password -------------------------------------------
	const [userOldPassword, setUserOldPassword] = useState();
	const [userNewPassword, setuserNewPassword] = useState("");
	const [userNewPassword2, setuserNewPassword2] = useState("");
	const [userAvatar, setUserAvatar] = useState(user?.avatar);

	// ------ User Avatar ---------------------------------------------
	const [avatar, setAvatar] = useState("");

	const onSuccess = () => {
		toast.success("Success");
	};

	const onErrors = (error) => {
		console.log(error);
		toast.error("Error");
	};

	const handleChangeInfo = () => {
		const userObject = {
			id: user.id,
			firstName: userFirstName,
			lastName: userLastName,
			email: userEmail,
			avatar: userAvatar,
		};

		updateProfile(userObject, onSuccess, onErrors);
	};

	const handleChangePassword = () => {
		changePassword(
			user.id,
			userOldPassword,
			userNewPassword,
			onSuccess,
			onErrors,
		);
	};

	const handleChangeAvatar = (files) => {
		const avatar = files[0];
		setAvatar(avatar);
	};

	const handleSubmitAvatar = async () => {
		const result = await uploadFile(avatar);
		const fullPath = result.metadata.fullPath;
		const route = `https://firebasestorage.googleapis.com/v0/b/${config.FIREBASE_PROYECT}.appspot.com/o/${fullPath}?alt=media`;

		setUserAvatar(route);
		localStorage.setItem("avatar", route);

		changeAvatar(user.id, route, onSuccess, onErrors);
		setImage(route);
	};

	return (
		<>
			<button onClick={onOpen}>
				<img
					className="w-12 h-12 rounded-full"
					src={image}
					alt="Rounded avatar"
				/>
			</button>
			<div className="mt-20">
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					className="w-full"
					scrollBehavior="inside"
					backdrop="blur"
				>
					<ModalContent className="bg-[#18181B] h-full w-full mt-10">
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1 text-white">
									{" "}
									Perfil de usuario{" "}
								</ModalHeader>
								<ModalBody className="w-full">
									<Input
										size="sm"
										type="text"
										label="First Name"
										value={userFirstName}
										onChange={(e) => setUserFirstName(e.target.value)}
										isRequired
									/>

									<Input
										size="sm"
										type="text"
										label="Last Name"
										value={userLastName}
										onChange={(e) => setUserLastName(e.target.value)}
										isRequired
									/>
									<Input
										size="sm"
										type="text"
										label="Email"
										value={userEmail}
										onChange={(e) => setUserEmail(e.target.value)}
										isRequired
									/>

									<Button color="primary" onPress={() => handleChangeInfo()}>
										Change
									</Button>

									<p className="text-white"> Cambiar contraseña </p>
									<Input
										size="sm"
										type="password"
										label="Escribe tu contraseña actual"
										value={userOldPassword}
										onChange={(e) => setUserOldPassword(e.target.value)}
										isRequired
									/>
									<Input
										size="sm"
										type="password"
										label="Escribe tu nueva contraseña"
										value={userNewPassword}
										onChange={(e) => setuserNewPassword(e.target.value)}
										isRequired
									/>
									<Input
										size="sm"
										type="password"
										label="Confirma tu nueva contraseña"
										value={userNewPassword2}
										onChange={(e) => setuserNewPassword2(e.target.value)}
										isRequired
									/>

									{userNewPassword === userNewPassword2 ? (
										<Button
											color="primary"
											data-testid='mi-boton'
											onPress={() => handleChangePassword()}
										>Change</Button>
									) : (
										<Button isDisabled color="danger">
											Change
										</Button>
									)}

									<div>
										<p className="text-white">
											{" "}
											Cambiar Avatar{" "}
											<img
												className="w-12 h-12 rounded-full"
												src={image}
												alt="Rounded avatar"
											/>
										</p>
										<input
											className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
											type="file"
											id="formFile"
											onChange={(e) => {
												handleChangeAvatar(e.target.files);
											}}
										/>
										<Button
											color="primary"
											onPress={handleSubmitAvatar}
											className="mb-2 mt-2"
										>
											Change Avatar
										</Button>
									</div>
								</ModalBody>
							</>
						)}
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}
