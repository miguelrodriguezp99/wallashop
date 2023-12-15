import React, { useState } from "react";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import { BiMessageAdd } from "react-icons/bi";
import { toast } from "sonner";
import { createComment, replyComment } from "../../../../backend/postService";

//State puede ser un post o un comentario dependiendo de donde se renderice este componente
export default function CreateCommentModal({ state, reply, setCommentCount }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [text, setText] = useState("");

	const onSuccess = (authenticatedUser) => {
		toast.success("Comment created.");
		setCommentCount((prevCount) => prevCount + 1);
		//navigate(`/wallashop/post/${state.id}`);
		//window.location.reload(true); //RESETEA LA STORE DE ZUSTAND!!!
	};

	const onErrors = (error) => {
		toast.error("Error creating comment.");
	};

	const handleSubmit = async (onClose) => {
		const commentObj = {
			text: text,
		};

		console.log(state);

		reply === false
			? createComment(state.id, commentObj, onSuccess, onErrors)
			: replyComment(state.post.id, commentObj, state.id, onSuccess, onErrors);

		onClose();
	};

	const handleKeyDown = (e, onClose) => {
		if (e.key === "Enter") {
			handleSubmit(onClose);
		}
	}

	return (
		<>
			{reply === false ? (
				<Button
					onPress={() => onOpen()}
					className="border border-gray-600 rounded text-white bg-[#18181B] hover:bg-gray-700 "
				>
					<BiMessageAdd size={25} color="white" />
				</Button>
			) : (
				<Button
					onPress={() => onOpen()}
					className="border border-gray-600 rounded text-white bg-[#18181B] hover:bg-gray-700 "
				>
					Reply
				</Button>
			)}

			<Modal
				isOpen={isOpen}
				size="xl"
				onOpenChange={onOpenChange}
				className="w-full"
			>
				<ModalContent className="bg-[#18181B] w-full">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-white">
								Add Comment
							</ModalHeader>
							<ModalBody className="w-full">
								<Textarea
									labelPlacement="outside"
									placeholder="Enter your description"
									className="w-full"
									value={text}
									onKeyDown={(e) => handleKeyDown(e, onClose)}
									onChange={(e) => setText(e.target.value)}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={() => handleSubmit(onClose())}>
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
