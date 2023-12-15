import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config/constants.js";
import "./../styles/navbar.css";
import UserModal from "./modals/userModal.js";
import NotificationModal from "./modals/notificationModal.js";
import { LogginContext } from "../context/loginContext.js";

export default function Narvarc() {
    const navigate = useNavigate();
    const { token, setToken } = useContext(LogginContext);
    const { setImage } = useContext(LogginContext);

    const handleNavigate = (route) => {
        navigate(`/wallashop/${route}`);
    }

    useEffect(() => {
        const avatar = localStorage.getItem('avatar');
        if (avatar !== null) {
            setImage(avatar);
        }
    }, [setImage]);


	useEffect(() => {
		const avatar = localStorage.getItem("avatar");
		if (avatar !== null) {
			setImage(avatar);
		}
	}, [setImage]);

	const handleLogout = () => {
		setToken(null);
		localStorage.removeItem("avatar");
		localStorage.removeItem(config.SERVICE_TOKEN_NAME);
		navigate("/wallashop");
	};
	
	useEffect(() => {
		document.documentElement.classList.add("html-menu");
		return () => {
			document.documentElement.classList.remove("html-menu");
		};
	}, []);

	return (
		<Navbar>
			<NavbarBrand>
				<p
					onClick={() => handleNavigate("")}
					className="font-bold text-2xl cursor-pointer"
				>
					Wallashop
				</p>
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					{token == null ? (
						<>
							<Button
								className="text-black ml-2"
								onPress={() => handleNavigate("login")}
								as={Button}
								color="primary"
								href="#"
								variant="flat"
							>Login</Button>
							<Button
								className="text-black ml-2"
								onPress={() => handleNavigate("register")}
								as={Button}
								color="primary"
								href="#"
								variant="flat"
							>
								Sign Up
							</Button>
						</>
					) : (
						<>
							<div className="flex gap-2 items-center">
							
								<NotificationModal />
								
								<Button
									className="text-black"
									// Agrega una función handleLogout
									as={Button}
									color="primary"
									href="#"
									variant="flat"
									onPress={() => handleLogout()}
								>
									Log out
								</Button>
								
								<UserModal />
								
							</div>				
						</>
					)}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
