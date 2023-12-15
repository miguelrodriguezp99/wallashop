import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFiltersStore } from "../store/filters";
import PostCarousel from "./PostCarousel";
import PostComments from "./PostComments";
import PostDetailCard from "./PostDetailCard";
import GlassCard from "./cards/GlassCard";

const PostDetails = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const getPostById = useFiltersStore((state) => state.getPostById);

	useEffect(() => {
		const postId = Number(id);
		const postObj = getPostById(postId);
		setPost(postObj);
	}, [id, getPostById]);

	if (!post) {
		return null;
	}

	return (
		<>
			<GlassCard>
				<header className="flex align-center justify-center mt-7 mx-10">
					<h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
						Post Details
					</h1>
				</header>

				<div id="container" className="flex-wrap wrap">
					<div className="flex flex-col md:flex-row mb-[60px] mt-5 mx-5 align-center justify-center">
						<PostCarousel post={post} />
						<PostDetailCard post={post} />
					</div>
				</div>
			</GlassCard>

			<PostComments post={post} />
		</>
	);
};

export default PostDetails;
