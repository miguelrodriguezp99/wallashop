import { Input, Option, Select, Slider } from "@material-tailwind/react";
import React from "react";
import { useFiltersStore } from "../store/filters";

export const Filters = () => {
	const price = useFiltersStore((state) => state.price); // Obtener el valor de price
	const setCategoryFilter = useFiltersStore((state) => state.setCategoryFilter); // Obtener la función setCategory
	const setPriceFilter = useFiltersStore((state) => state.setPriceFilter); // Obtener la función setPrice
	const setTypeFilter = useFiltersStore((state) => state.setTypeFilter); // Obtener la función setType
	const query = useFiltersStore((state) => state.query);
	const setQuery = useFiltersStore((state) => state.setQuery);
	const setStillValidFilter = useFiltersStore((state) => state.setStillValid);
	const setCreatedFilter = useFiltersStore((state) => state.setCreated);
	const setExpirationDateFilter = useFiltersStore((state) => state.setExpDate);
	const setSort = useFiltersStore((state) => state.setSort);
	const sort = useFiltersStore((state) => state.sort);

	function setStillValid(data) {
		isNaN(data) ? setStillValidFilter(null) : setStillValidFilter(data);
	}

	function setCreated(data) {
		isNaN(data) ? setCreatedFilter(null) : setCreatedFilter(data);
	}

	function setExpirationDate(data) {
		isNaN(data) ? setExpirationDateFilter(null) : setExpirationDateFilter(data);
	}

	function applySort(t) {
		if (sort === t) {
			setSort(null);
		} else {
			setSort(t);
		}
	}

	return (
		<div className="mt-5 max-w-full mx-auto flex items-center align-center justify-center flex-wrap gap-3">
			<div className="flex justify-center align-center">
				<div className="mt-2">
					<Slider
						id="range"
						type="range"
						min={0}
						max={100}
						step={1}
						defaultValue={0}
						onChange={(e) => setPriceFilter(e.target.value)}
					/>
					<span className="ml-2 mr-2">{price}€</span>
					<div className="inline-flex mt-2">
					<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("PriceAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("PriceDesc")}>
						↓
					</button>
				</div>
				</div>

			</div>

			<div>
				<Select
					color="teal"
					label="Select category"
					onChange={(e) => setCategoryFilter(e)}
					size="md"
					className="text-white bg-gray-400"
				>
					<Option value="all">All</Option>
					<Option value="Electronics">Electronics</Option>
					<Option value="Clothes">Clothes</Option>
					<Option value="Furniture">Furniture</Option>
					<Option value="Books">Books</Option>
				</Select>

				<div className="inline-flex mt-2">
					<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("CategoryAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("CategoryDesc")}>
						↓
					</button>
				</div>
			</div>
			<div>
				<div className="ml-2 mr-2">
					<Select
						color="teal"
						label="Select Type"
						onChange={(e) => setTypeFilter(e)}
						size="md"
						className="text-white bg-gray-400"
					>
						<Option value="all">All</Option>
						<Option value="COUPON">Coupons</Option>
						<Option value="OFFER">Offers</Option>
					</Select>
				</div>
				<div className="inline-flex mt-2">
				<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("TypeAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("TypeDesc")}>
						↓
					</button>
				</div>
			</div>

			<div>
				<Input
					type="text"
					id="search"
					color="teal"
					className="text-white bg-gray-400"
					label="Buscar"
					labelProps={{
						className: "text-teal-200",
					}}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<div className="inline-flex mt-2">
				<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("NameAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("NameDesc")}>
						↓
					</button>
				</div>
			</div>

			<div>
				<div className="ml-2 mr-2">
					<Input
						id="stillValidFilter"
						className="bg-gray-400"
						color="teal"
						type="date"
						label="Still Valid"
						labelProps={{
							className: "text-teal-200",
						}}
						onChange={(e) => setStillValid(e.target.valueAsNumber)}
					/>
				</div>
				<div className="inline-flex mt-2">
				<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("ValidAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("ValidDesc")}>
						↓
					</button>
				</div>
			</div>

			<div>
				<Input
					id="createdFilter"
					className="bg-gray-400"
					color="teal"
					type="date"
					label="Created"
					labelProps={{
						className: "text-teal-200",
					}}
					onChange={(e) => setCreated(e.target.valueAsNumber)}
				/>
				<div className="inline-flex mt-2">
				<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("CreatedAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("CreatedDesc")}>
						↓
					</button>
				</div>
			</div>

			<div>
				<div className="ml-2 mr-2">
					<Input
						id="expDate"
						className="bg-gray-400"
						color="teal"
						type="date"
						label="Expiration"
						labelProps={{
							className: "text-teal-200",
						}}
						onChange={(e) => setExpirationDate(e.target.valueAsNumber)}
					/>
				</div>
				<div className="inline-flex mt-2">
				<button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-1 px-4 rounded-l" onClick={() => applySort("ExpiresAsc")}>
						↑
					</button>
					<button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-1 px-4 rounded-r" onClick={() => applySort("ExpiresDesc")}>
						↓
					</button>
				</div>
			</div>
		</div>
	);
};
