import {
	Avatar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
} from "@nextui-org/react";

import CreateCommentModal from "./modals/CreateCommentModal";

const CommentCard = ({ comment, setCommentCount }) => {
	return (
		<div className="flex justify-center align-center items-center mb-10">
			<Card className="bg-[#171717] w-full max-w-[500px]">
				<CardHeader className="justify-between">
					<div className="flex gap-5">
						<Avatar
							isBordered
							radius="full"
							size="md"
							src={comment.user.avatar}
						/>
						
						<div className="flex flex-col gap-1 items-start justify-center">
							<h4 className="text-small font-semibold leading-none text-default-600">
								{comment.user.userName}
							</h4>
							<h5 className="text-small tracking-tight text-default-400">
								{comment.user.email}
							</h5>
						</div>
					</div>
				</CardHeader>
				<CardBody className="px-3 py-0 text-small text-default-400 text-white">
					<p>{comment.text}</p>
				</CardBody>
				<CardFooter className="gap-3">
					<div className="flex gap-1">
						<CreateCommentModal
							state={comment}
							reply={true}
							setCommentCount={setCommentCount}
						/>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default CommentCard;
