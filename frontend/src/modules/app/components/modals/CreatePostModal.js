import React, { useState } from "react";

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postPosts } from "../../../../backend/postService.js";
import { uploadFile } from "../../firebase/config.js";
import Selector from "../selectors/Selector.js";
import TypeSelector from "../selectors/TypeSelector.js";
import StompService from "./../../socket/StompService.js";
import { config } from "../../../../config/constants.js";

export default function ModalB() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categ, setCateg] = useState("");
	const [price, setPrice] = useState(0);
	const [imagesState, setImagesState] = useState([]);
	const [type, setType] = useState("");
	const [couponCode, setCouponCode] = useState("");
	const [url, setUrl] = useState("");
	const [expirationDate, setExpirationDate] = useState("");
	const [auxExpirationDate, setAuxExpirationDate] = useState("");
	const miproyecto = "ferramentas-desarrollo";
	

	const onSuccess = () => {
		toast.success("Post creado.");

		const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
		if (StompService.client && StompService.client.connected) {
			StompService.send("/app/handleNotifications", JSON.stringify({success: true, userId: bearer.slice(-7) }));
			
		} else {
			console.error("STOMP connection is not established");
		}

		navigate("/wallashop/");
		window.location.reload(true);
	};

	const onErrors = (error) => {
		toast.error("Error al crear el post.");
	};

	const handleImageChange = (files) => {
		const imagesArray = Array.from(files);
		setImagesState(imagesArray);
	};

	const uploadImages = async () => {
		const imageRoutes = [];
		for (const image of imagesState) {
			const result = await uploadFile(image);
			const fullPath = result.metadata.fullPath;
			const route = `https://firebasestorage.googleapis.com/v0/b/${miproyecto}.appspot.com/o/${fullPath}?alt=media`;
			imageRoutes.push(route);
		}

		return imageRoutes;
	};

	const handleSubmit = async () => {
		const images = await uploadImages();
		const category = { id: parseInt(categ) };

		const post = {
			title,
			description,
			url,
			price,
			images,
			category,
			type,
			couponCode,
			expirationDate,
		};
		postPosts(post, onSuccess, onErrors);
	};

	function appendTimeToDateString(inputDate) {
		// Agrega la parte de la hora al final de la cadena de fecha
		return `${inputDate}T00:00:00.000`;
	}

	return (
		<>
			<Button
				className="fixed bottom-10 right-10 p-5 bg-blue-500 text-white rounded-full shadow-lg "
				onPress={onOpen}
			>
				Add Post
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full">
				<ModalContent className="bg-[#18181B] w-full">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-white">
								Add post
							</ModalHeader>
							<ModalBody className="w-full">
								<Input
									type="text"
									label="Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									isClearable
									isRequired
								/>

								<Textarea
									labelPlacement="outside"
									placeholder="Enter your description"
									className="w-full"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>

								<Input
									type="text"
									placeholder="Enter your url"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									isRequired
								/>

								<Input
									type="date"
									label="Expiration Date"
									placeholder="Enter your expiration date"
									value={auxExpirationDate}
									disableAnimation={true}
									onChange={(e) => {
										setAuxExpirationDate(e.target.value);
										const formattedDateTime = appendTimeToDateString(
											e.target.value,
										);
										setExpirationDate(formattedDateTime);
									}}
									isRequired
								/>

								<TypeSelector value={type} fn={setType} isRequired />

								{type === "COUPON" && (
									<Textarea
										labelPlacement="outside"
										placeholder="Enter your coupon code"
										className="w-full"
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
									/>
								)}

								<Selector
									value={categ}
									fn={setCateg}
									placeholder="Seleccione una categoría"
									isRequired
								/>

								<Input
									type="number"
									value={price}
									onChange={(e) => setPrice(parseFloat(e.target.value))}
									placeholder="0.00"
									labelPlacement="outside"
									isRequired
									startContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">€</span>
										</div>
									}
								/>
								<label
									for="formFile"
									class="mt-4 inline-block dark:text-neutral-200 text-white"
								>
									Fotos
								</label>
								<input
									className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
									type="file"
									id="formFile"
									multiple
									onChange={(e) => {
										handleImageChange(e.target.files);
									}}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={handleSubmit}>
									Submit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
