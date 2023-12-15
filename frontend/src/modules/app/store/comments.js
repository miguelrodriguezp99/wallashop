import { create } from "zustand";
import { getPostComments } from "../../../backend/postService";

export const useCommentsStore = create((set, get) => ({
	commentsByPost: [],

	fetchComments: async (postId) => {
		try {
			getPostComments(
				postId,
				(data) => {
					console.log("data", data);
					// Compara el nuevo array de comentarios con el existente
					if (!arraysEqual(data, get().commentsByPost)) {
						set({ commentsByPost: data });
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
