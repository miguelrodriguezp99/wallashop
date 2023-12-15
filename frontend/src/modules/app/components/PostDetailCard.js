import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Image,
	Link,
	Textarea,
} from "@nextui-org/react";
import React, { useContext, useState, useEffect } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BiSolidCoupon } from "react-icons/bi";
import { PiSealCheck, PiBellSimpleRinging, PiBellSimpleSlash } from "react-icons/pi";
import { toast } from "sonner";
import { ratePost, stillValid, followPost, deleteFollow } from "../../../backend/postService";
import { LogginContext } from "../context/loginContext";
import useCountedRates from "../hooks/useCountedRates";
import useDidUserVote from "../hooks/useDidUserVote";
import { useFollowsStore } from "../store/follows";

const PostDetailCard = ({ post }) => {
	//--- CUSTOM HOOKS -------------------------
	const { nrates, setNRates } = useCountedRates(post.id);
	const { vote, setVote } = useDidUserVote(post.id);
	const { user } = useContext(LogginContext);
	const [isFollowing, setIsFollowing] = useState(false);
  	const [followId, setFollowId] = useState(null);
	const { followsByPost, fetchFollows } = useFollowsStore();

	useEffect(() => {
		// Verificar si el usuario actual está en la lista de seguidores
		fetchFollows(post.id);
		const userFollow = followsByPost.find((follow) => follow.user.id === user.id);
	  
		if (userFollow) {
		  setFollowId(userFollow.id);
		} else {
		  setFollowId(null);
		}
	  }, [isFollowing, followsByPost, user.id, post.id, fetchFollows]);

	const onSuccessVoteLike = () => {
		if (vote !== null) {
			setNRates({
				trueRatesCount: nrates.trueRatesCount + 1,
				falseRatesCount: nrates.falseRatesCount - 1,
			});
		} else {
			setNRates({
				trueRatesCount: nrates.trueRatesCount + 1,
				falseRatesCount: nrates.falseRatesCount,
			});
		}
		setVote(true);
		toast.success("Has votado positivamente.");
	};

	const onSuccessVoteDislike = () => {
		if (vote !== null) {
			setNRates({
				trueRatesCount: nrates.trueRatesCount - 1,
				falseRatesCount: nrates.falseRatesCount + 1,
			});
		} else {
			setNRates({
				trueRatesCount: nrates.trueRatesCount,
				falseRatesCount: nrates.falseRatesCount + 1,
			});
		}
		setVote(false);
		toast.success("Has votado negativamente.");
	};

	const handleVoteLike = () => {
		ratePost(post.id, true, onSuccessVoteLike, onErrorsVote);
	};

	const handleVoteDislike = () => {
		ratePost(post.id, false, onSuccessVoteDislike, onErrorsVote);
	};

	const onErrorsVote = () => {
		toast.error("Ha ocurrido un error.");
	};

	const handleStillValid = () => {
		stillValid(post.id);
		toast.success("Has marcado el cupón como válido.");
	};
	
	const onSuccessFollow = (data) => {
		toast.success("Post seguido correctamente.");
		setFollowId(data.id);
	};

	const onErrorsFollow = () => {
		toast.error("Error al seguir el post.");
	};

	const onSuccessUnfollow = (data) => {
		toast.success("Se dejó de seguir el post correctamente.");
		setFollowId(null);
	};

	const onErrorsUnfollow = () => {
		toast.error("Error al dejar de seguir el post.");
	};
	
	const handleFollowClick = () => {
		const following = followId === null;

		
		if(following){
		 	followPost(post.id, onSuccessFollow, onErrorsFollow)
		}else{
			deleteFollow(post.id, followId, onSuccessUnfollow, onErrorsUnfollow)
		}
		setIsFollowing(following);
	}

	// --- AVOID FETCH POSTS ----
	// const [nrates, setNRates] = useState({});
	// const [vote, setVote] = useState(null);

	// const handleVoteLike = () => {
	// 	console.log("like");
	// };
	// const handleVoteDislike = () => {
	// 	console.log("like");
	// };
	// const onErrorsVote = () => {
	// 	console.log("like");
	// };

	return (
		<div id="content" className="w-full md:w-1/2 md:ml-6 mt-3">
			<Card className="w-full min-w-[300px] md:min-w-0 h-auto bg-[#0C0C0D]">
				<div className="divide-y divide-blue-200 hover:divide-blue-400">
					<CardHeader className="gap-3 flex items-center justify-center mt-0 mb-2">
						<Image
							alt="avatar"
							height={40}
							radius="sm"
							src={post.user.avatar}
							width={40}
						/>
						<div className="flex flex-col">
							<p className="text-md text-white">{post.user.userName}</p>
							<p className="text-small text-default-500">{post.user.email}</p>
						</div>
					</CardHeader>
					<CardBody className="flex items-center justify-center mt-0">
						<p className="text-white font-medium mb-1">Title: {post.title}</p>
						<div className="w-full">
							<Textarea
								maxRows={3}
								label="Description"
								labelPlacement="inside"
								isReadOnly
								placeholder={post.description}
								className="w-full"
							/>
						</div>

						<p className="text-white font-medium">
							Category: {post.category.name}
						</p>
						<Link href={post.url}>URL: {post.url}</Link>
						<p className="text-white font-medium">
							Expiration Date {post.expirationDate}
						</p>
						<p className="text-green-500 font-medium">Post Type: {post.type}</p>
						<p className="text-white font-medium">Price: {post.price} €</p>

						{post.type === "COUPON" && (
							<div className="mb-0 right-5 flex items-start">
								<BiSolidCoupon
									size={30}
									className="mt-3 text-green-400 border-r-4 border-transparent padding-t-4"
								/>
								<div className="mt-4 text-green-400 ">{post.couponCode}</div>
							</div>
						)}
					</CardBody>
					<CardFooter className="flex items-center justify-center mt-0">
						<div
							id="like-buttons"
							className="flex items-center justify-center mt-3"
						>
							{user.id !== post.user.id && (
								<div className="flex">
								{
									<div className="mb-2 mt-6 mr-5">
										<Button className="border border-white rounded text-white bg-[#18181B] hover:bg-gray-400"
										onClick={handleFollowClick}
										>
										{followId === null ? <PiBellSimpleRinging size={25} color="#fff"/> : <PiBellSimpleSlash size={25} color="#fff"/> }
										</Button>
									</div>
								}
									<div className="mb-2 mt-6 mr-5">								
										<Button
											onPress={() => handleStillValid()}
											// rome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
											className={`border border-blue-600 rounded text-white bg-[#18181B] hover:bg-blue-300`}
										>
											<PiSealCheck size={25} color="rgb(37,95,235)" />
										</Button>

										{!(
											post.stillValid === undefined || post.stillValid === null
										) ? (
											<div className="relative text-center text-white mt-1 ml-auto text-small">
												<span className="text-green-600">
													{post.stillValid.split("T").slice(0, 1)}
												</span>
												<br />
												<span className="text-green-600">
													{post.stillValid
														.split("T")
														.slice(1, 2)
														.join(" ")
														.split(".")
														.slice(0, 1)}
												</span>
											</div>
										) : (
											<div className="relative text-center text-white mt-1 ml-auto text-small mb-5">
												<span className="text-green-600">Never!</span>
												<br />
											</div>
										)}
									</div>
								</div>
							)}
							<div>
								<Button
									data-testid="like-button"
									onPress={() => handleVoteLike()}
									isDisabled={vote === true}
									className={`border border-green-600 rounded text-white bg-[#18181B] hover:bg-green-300 ${
										vote === true ? "bg-green-300" : ""
									}`}
								>
									<AiOutlineLike size={25} color="green" />
								</Button>
								{nrates?.trueRatesCount ? (
									<p className="text-white flex justify-center mt-1">
										{nrates?.trueRatesCount}
									</p>
								) : (
									<p className="text-white flex justify-center mt-1">0</p>
								)}
							</div>

							<div className="ml-5">
								<Button
									onPress={() => handleVoteDislike()}
									isDisabled={vote === false}
									className={`border border-red-600 rounded text-white bg-[#18181B] hover:bg-red-300 ${
										vote === false ? "bg-red-300" : ""
									}`}
								>
									<AiOutlineDislike size={25} color="red" />
								</Button>
								{nrates?.falseRatesCount ? (
									<p className="text-white flex justify-center mt-1">
										{nrates?.falseRatesCount}
									</p>
								) : (
									<p className="text-white flex justify-center mt-1">0</p>
								)}
							</div>
						</div>
					</CardFooter>
				</div>
			</Card>
		</div>
	);
};

export default PostDetailCard;
