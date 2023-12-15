import React from "react";

const GlassCard = ({ children }) => {
	return (
		<>
			<div
				id="glass"
				className="bg-gray-600 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-blue-200 gap-5 mt-10 min-w-[375px]
        hover:border-blue-400"
				style={{
					width: "75%",
					margin: "60px auto 0", // Esto centrará el div horizontalmente
				}}
			>
				{" "}
				{children}
			</div>
		</>
	);
};

export default GlassCard;
