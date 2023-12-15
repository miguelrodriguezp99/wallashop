import { create } from "zustand";
import { getPostFollows } from "../../../backend/postService";

export const useFollowsStore = create((set, get) => ({
	followsByPost: [],

	fetchFollows: async (postId) => {
		try {
			getPostFollows(
				postId,
				(data) => {
					console.log("data", data);
					// Compara el nuevo array de follows con el existente
					if (!arraysEqual(data, get().followsByPost)) {
						set({ followsByPost: data });
					}
				},
				(errors) => {
					console.log(errors);
				},
			);
			// onSuccess y OnErrors están metidos en la propia función en este caso
		} catch (error) {
			console.error(error);
		}
	},
}));

// Función para comparar dos arrays
function arraysEqual(arr1, arr2) {
	return JSON.stringify(arr1) === JSON.stringify(arr2);
}