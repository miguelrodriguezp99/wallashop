import {
	Button,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { toast } from "sonner";
import { editPost } from "../../../../backend/postService.js";
import Selector from "../selectors/Selector.js";
import "./../../styles/navbar.css";

export default function EditPostModal({ post }) {
	// ------ Context -----------------------------------------------
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	const [postTitle, setPostTitle] = useState(post?.title);
	const [postDescription, setPostDescription] = useState(post?.description);
	const [postUrl, setPostUrl] = useState(post?.url);
	const [postPrice, setPostPrice] = useState(post?.price);
	const [postCategory, setPostCategory] = useState(post?.category?.name);
	const [isActive, setIsActive] = useState(post?.active);

	const onSuccess = () => {
		toast.success("Post editado.");
		window.location.reload(true);
	};

	const onErrors = () => {
		toast.error("Error al editar el post.");
	};

	const handleSubmit = () => {
		const postDto = {
			title: postTitle,
			description: postDescription,
			url: postUrl,
			price: postPrice,
			images: post.images,
			active: isActive,
		};

		console.log(postDto);

		editPost(post.id, postDto, onSuccess, onErrors);
	};

	return (
		<>
			<Button
				onClick={onOpen}
				className="mt-6 border border-green-600 rounded text-white bg-[#18181B] hover:bg-green-500"
			>
				<RiEditBoxLine size={20} />
			</Button>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="w-full"
				scrollBehavior="inside"
				backdrop="blur"
			>
				<ModalContent className="bg-[#18181B] w-full mt-10">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-white">
								{" "}
								Editar el post{" "}
							</ModalHeader>
							<ModalBody className="w-full" >
								<Input 
									size="sm"
									type="text"
									label="Title"
									value={postTitle}
									onChange={(e) => setPostTitle(e.target.value)}
									isRequired
								/>

								<Input
									size="sm"
									type="text"
									label="Description"
									value={postDescription}
									onChange={(e) => setPostDescription(e.target.value)}
									isRequired
								/>
								<Input
									size="sm"
									type="text"
									label="URL"
									value={postUrl}
									onChange={(e) => setPostUrl(e.target.value)}
									isRequired
								/>

								<Input
									type="number"
									value={postPrice}
									onChange={(e) => setPostPrice(parseFloat(e.target.value))}
									placeholder={postPrice}
									labelPlacement="outside"
									isRequired
									startContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-default-400 text-small">€</span>
										</div>
									}
								/>
								<Selector
									value={postCategory}
									fn={setPostCategory}
									placeholder={post.category.name}
									isRequired
								/>
								<div className="flex flex-col gap-2">
									<Checkbox isSelected={isActive} onValueChange={setIsActive} />
									<p className="text-default-500">
										Post Status: {isActive ? "Active" : "Inactive"}
									</p>
								</div>
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
