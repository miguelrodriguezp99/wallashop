import React from "react";

import { Select, SelectItem } from "@nextui-org/react";

//TODO IMPORT CATEGORIES FROM DATA
const categories = [
	{ value: "1", label: "Electronics" },
	{ value: "2", label: "Clothes" },
	{ value: "3", label: "Furniture" },
	{ value: "4", label: "Books" },
];

export default function Selector({ value, fn, placeholder }) {
	return (
		<Select
			items={categories}
			label="Category"
			value={value}
			onChange={(e) => fn(e.target.value)}
			placeholder={placeholder}
			className="w-full"
		>
			{(category) => (
				<SelectItem key={category.value}>{category.label}</SelectItem>
			)}
		</Select>
	);
}
