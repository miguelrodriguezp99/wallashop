import { create } from "zustand";
import { getPosts } from "../../../backend/postService";

export const useFiltersStore = create((set, get) => ({
	price: "0",
	category: "all",
	type: "all",
	query: "",
	posts: [],
	filteredPosts: [],
	stillValid: null,
	created: null,
	expDate: null,
	sort: null,

	setStillValid: (stillValid) => set({ stillValid }),
	setCreated: (created) => set({ created }),
	setExpDate: (expDate) => set({ expDate }),

	setPriceFilter: (price) => set({ price }),

	setCategoryFilter: (category) => set({ category }),

	setTypeFilter: (type) => set({ type }),

	setPosts: (posts) => set({ posts }),

	setFilteredPosts: (filteredPosts) => set({ filteredPosts }),

	setQuery: (query) => set({ query }),

	setSort: (sort) => set({ sort }),

	getFilters: () => ({
		price: get().price,
		category: get().category,
	}),

	fetchPosts: async () => {
		try {
			getPosts(
				{ page: 0, size: 10 },
				(data) => {
					set({ posts: data.content });
				},
				(errors) => {
					console.log(errors);
				},
			);
		} catch (error) {
			console.error(error);
		}
	},

	filterPosts: () => {
		const {
			price,
			category,
			type,
			query,
			posts,
			stillValid,
			created,
			expDate,
		} = get();

		const filteredPosts1 = posts.filter((post) => {
			const meetsPriceCriteria = post.price >= parseFloat(price);
			const meetsCategoryCriteria =
				category === "all" || post.category.name === category;
			const meetsTypeCriteria = type === "all" || post.type === type;
			const meetsSearchCriteria =
				post.title.toLowerCase().includes(query.toLowerCase()) ||
				post.description.toLowerCase().includes(query.toLowerCase());

			let meetsStillValidCriteria = true;
			if (stillValid !== null || isNaN(stillValid)) {
				meetsStillValidCriteria =
					(post.stillValid !== null || post.stillValid !== undefined) &&
					Date.parse(post.stillValid) >= stillValid;
			}

			let meetsCreatedCriteria = true;
			if (created !== null || isNaN(created)) {
				meetsCreatedCriteria =
					(post.creationDate !== null || post.creationDate !== undefined) &&
					Date.parse(post.creationDate) >= created;
			}

			let meetsExpiratedCriteria = true;
			if (expDate !== null || isNaN(expDate)) {
				meetsExpiratedCriteria =
					(post.expirationDate !== null || post.expirationDate !== undefined) &&
					Date.parse(post.expirationDate) >= expDate;
			}

			return (
				meetsPriceCriteria &&
				meetsCategoryCriteria &&
				meetsTypeCriteria &&
				meetsSearchCriteria &&
				meetsStillValidCriteria &&
				meetsCreatedCriteria &&
				meetsExpiratedCriteria
			);
		});

		const filteredPosts = [...filteredPosts1];
		const { sort } = get();
		switch (sort) {
			case 'NameAsc':
			  filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
			  break;
			case 'titleDesc':
			  filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
			  break;
			case 'CategoryAsc':
			  filteredPosts.sort((a, b) => a.category.name.localeCompare(b.category.name));
			  break;
			case 'CategoryDesc':
			  filteredPosts.sort((a, b) => b.category.name.localeCompare(a.category.name));
			  break;
			case 'TypeAsc':
			  filteredPosts.sort((a, b) => a.type.localeCompare(b.type));
			  break;
			case 'TypeDesc':
			  filteredPosts.sort((a, b) => b.type.localeCompare(a.type));
			  break;
			case 'PriceAsc':
			  filteredPosts.sort((a, b) => a.price - b.price);
			  break;
			case 'PriceDesc':
			  filteredPosts.sort((a, b) => b.price - a.price);
			  break;
			case 'ValidAsc':
				filteredPosts.sort((a, b) => {
					if (a.stillValid != null && b.stillValid != null) return a.stillValid.localeCompare(b.stillValid);
					if (a.stillValid != null) return -1;
					else if (b.stillValid != null) return -1;
					return 0;
				  });
			  break;
			case 'ValidDesc':
				filteredPosts.sort((a, b) => {
					if (a.stillValid != null && b.stillValid != null) return a.stillValid.localeCompare(b.stillValid);
					if (a.stillValid != null) return -1;
					else if (b.stillValid != null) return -1;
					return 0;
				  });
				  break;
			case 'CreatedAsc':
			  filteredPosts.sort((a, b) => a.creationDate.localeCompare(b.creationDate));
			  break;
			case 'CreatedDesc':
			  filteredPosts.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
			  break;
			case 'ExpiresAsc':
			  filteredPosts.sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
			  break;
			case 'ExpiresDesc':
			  filteredPosts.sort((a, b) => b.expirationDate.localeCompare(a.expirationDate));
			  break;
			default:
			  break;
		}

		set({ filteredPosts });
	},

	getPostById: (id) => {
		const { posts } = get();

		if (posts.length === 0) {
			get().fetchPosts();
			return null;
		}

		return posts.find((post) => post.id === id);
	},
}));
