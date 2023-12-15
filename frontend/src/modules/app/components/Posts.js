import { useFiltersStore } from "../store/filters";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import "../styles/posts.css";

import PostCard from "./PostCard";

const Posts = () => {
	const {
		price,
		category,
		type,
		fetchPosts,
		filterPosts,
		posts,
		filteredPosts,
		query,
		stillValid,
		created,
		expDate,
		sort
	} = useFiltersStore();

	useEffect(() => {
		fetchPosts();
	}, []);

	// ---- AVOID FETCH POSTS ----
	//const postsJSON = PostsJSON.posts;

	useEffect(() => {
		filterPosts();
	}, [price, category, posts, type, query, stillValid, created, expDate, sort]);

	return (
		<>
			<section className="container mx-auto p-10 md:py-20 px-0 md:p-10 md:px-0 bg-black mt-5">
				<section className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 items-start">
					{filteredPosts.map((post, index) => {
						return <PostCard key={index} post={post} />;
					})}
				</section>
			</section>
		</>
	);
};

export default Posts;
