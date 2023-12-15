import React from "react";

import { Select, SelectItem } from "@nextui-org/react";

//TODO IMPORT CATEGORIES FROM DATA
const types = [
	{ value: "OFFER", label: "Offers" },
	{ value: "COUPON", label: "Coupons" },
];

export default function TypeSelector({ value, fn }) {
	return (
		<Select
			items={types}
			label="Type"
			value={value}
			onChange={(e) => fn(e.target.value)}
			placeholder="Select a type"
			className="w-full"
		>
			{(type) => <SelectItem key={type.value}>{type.label}</SelectItem>}
		</Select>
	);
}
