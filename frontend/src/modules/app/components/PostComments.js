/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useCommentsStore } from "../store/comments";
import CommentCard from "./CommentCard";
import CreateCommentModal from "./modals/CreateCommentModal";

const CommentList = ({ comments, depth = 0, setCommentCount }) => {
	return (
		<>
			{comments.map((comment) => (
				<div key={comment.id} style={{ marginLeft: depth * 50 }}>
					<CommentCard comment={comment} setCommentCount={setCommentCount} />
					{comment.childComments && comment.childComments.length > 0 && (
						<CommentList
							comments={comment.childComments}
							depth={depth < 1 ? depth + 1 : depth}
							setCommentCount={setCommentCount}
						/>
					)}
				</div>
			))}
		</>
	);
};

const PostComments = ({ post }) => {
	const { commentsByPost, fetchComments } = useCommentsStore();
	const [commentCount, setCommentCount] = useState(0);

	//Tenemos que hacer el fetch de los comentarios del post
	useEffect(() => {
		fetchComments(post.id);
	}, [commentCount, fetchComments, post.id]);

	if (!commentsByPost) {
		return null;
	}

	return (
		<div id="comments" className="flex flex-col items-center mt-10 mb-10">
			<header className="flex align-center justify-center mt-7 mx-10">
				<h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text mb-5">
					Comments
				</h1>
				<div className="flex items-center mb-2 ml-3">
					<CreateCommentModal
						state={post}
						reply={false}
						setCommentCount={setCommentCount}
					/>
				</div>
			</header>

			<div id="commentList" className="flex w-full justify-center align-center">
				<div
					id="scroll"
					className="w-4/5 max-h-screen overflow-auto bg-[#000000] mt-5"
				>
					{commentsByPost.length !== undefined && (
						<CommentList
							comments={commentsByPost}
							setCommentCount={setCommentCount}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostComments;
