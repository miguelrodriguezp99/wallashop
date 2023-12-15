import React from "react";
import { Carousel } from "@material-tailwind/react";

const PostCarousel = ({ post }) => {
	return (
		<Carousel className="rounded-xl min-w-[300px] max-w-[500px] h-auto mt-3 transform duration-500 group shadow hover:shadow-white">
			{
				// Ponemos las imagenes del post
				post.images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt="ds"
						className="h-full w-full object-cover shadow-xl"
					/>
				))
			}
		</Carousel>
	);
};

export default PostCarousel;
