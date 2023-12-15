import { Button } from "@nextui-org/react";
import React, { useContext } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deletePost } from "../../../backend/postService";
import { LogginContext } from "../context/loginContext.js";
import EditPostModal from "./modals/EditPostModal.js";
import StompService from "./../socket/StompService.js";
import { config } from "../../../config/constants.js";

import "../styles/posts.css";

const PostCard = ({ post }) => {
	const { user } = useContext(LogginContext);
	const navigate = useNavigate();

	if (post.stillValid != null) {
		var date = post.stillValid.split("T").slice(0, 1);
		var time = post.stillValid
			.split("T")
			.slice(1, 2)
			.join(" ")
			.split(".")
			.slice(0, 1);
	}

	const handleDelete = () => {
		deletePost(post.id, onSuccess, onErrors);
	};

	const onSuccess = () => {
		toast.success("Post borrado correctamente.");

		const bearer = localStorage.getItem(config.SERVICE_TOKEN_NAME);
		if (StompService.client && StompService.client.connected) {
			StompService.send("/app/handleNotifications", JSON.stringify({success: true, userId: bearer.slice(-7) }));
			
		} 

		navigate("/wallashop/");
		window.location.reload(true);
	};

	const onErrors = () => {
		toast.error("Error al borrar el post.");
	};
	return (
		<>
			<article className="p-5 transform duration-300 hover:-translate-y-1 cursor-pointer group hover:shadow-white bg-cardback ml-2 rounded-md">
				{post.type === "OFFER" ? (
					<div className="folded-ribbon text-lg bg-pink-400">Oferta</div>
				) : (
					<div className="folded-ribbon text-lg bg-purple-500">Cupón</div>
				)}
				<div className=" relative max-h-125 overflow-hidden">
					<img className="absolute rounded-md" src={post.images[0]} alt="" />
					{post.images.length > 1 ? (
						<img
							className="relative transform duration-500 group-hover:opacity-0 rounded-md"
							src={post.images[1]}
							alt=""
						/>
					) : (
						<img
							className="relative transform duration-500 group-hover:opacity-0 rounded-md"
							src={post.images[0]}
							alt=""
						/>
					)}
				</div>
				<ul className="mt-6 font-semibold text-gray-500 text-left ml-1">
					<li className="inline mr-3 pb-1 border-b-2 border-green-500">
						{post.category.name}
					</li>
				</ul>
				<p className="mt-6 text-xl leading-relaxed text-white">{post.title}</p>

				<p className="text-gray-400 mt-2 font-semibold text-sm">
					{post.price} €
				</p>

				<div className="flex flex-row justify-between">
					<Button
						onPress={() => {
							navigate(`/wallashop/post/${post.id}`);
						}}
						className="mt-6 border border-green-600 rounded text-white bg-[#18181B] hover:bg-green-500"
					>
						Details
					</Button>

					{!(post.stillValid === null || post.stillValid === undefined) &&
						user.id !== post.user.id && (
							<div className="relative mt-6 right-1 ml-auto flex-2 text-small">
								Still Valid:
								<br />
								<span className="text-green-600">{date}</span>
								<span className="text-green-600">{" " + time}</span>
							</div>
						)}

					{user?.id === post.user.id && (
						<>
							<EditPostModal post={post} />

							<Button
								onPress={() => handleDelete()}
								className="mt-6 border border-red-600 rounded text-white bg-[#18181B] hover:bg-red-500"
							>
								<RiDeleteBin7Line size={20} />
							</Button>
						</>
					)}
				</div>
				{!(post.stillValid === null || post.stillValid === undefined) &&
					user.id === post.user.id && (
						<div className="relative mt-6 right-1 ml-auto flex-2 text-small">
							Still Valid:
							<br />
							<span className="text-green-600">{date}</span>
							<span className="text-green-600">{" " + time}</span>
						</div>
					)}
			</article>
		</>
	);
};

export default PostCard;
