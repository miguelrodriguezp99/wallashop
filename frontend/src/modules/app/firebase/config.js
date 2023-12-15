import 'text-encoding';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";


const firebaseApiKey = process.env.REACT_APP_FIREBASE_API_KEY;

const firebaseConfig = {
	apiKey: firebaseApiKey,
	authDomain: "ferramentas-desarrollo.firebaseapp.com",
	projectId: "ferramentas-desarrollo",
	storageBucket: "ferramentas-desarrollo.appspot.com",
	messagingSenderId: "189925566858",
	appId: "1:189925566858:web:782b74723cb03dae5ec073",
	
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file) {
	const storageRef = ref(storage, v4());
	return await uploadBytes(storageRef, file);
}
