import { config } from "../config/constants.js";
import NetworkError from "./NetworkError";

let networkErrorCallback;
let reauthenticationCallback;

// Funcion que verifica si una respuesta HTTP tiene el encabezado "content-type" establecido como "application/json".
// Esto es útil para determinar si una respuesta es un objeto JSON o no.
const isJson = (response) => {
	const contentType = response.headers.get("content-type");

	return contentType && contentType.indexOf("application/json") !== -1;
};

// Maneja respuestas exitosas (códigos de estado 200-299).
// Comprueba si la respuesta es exitosa (response.ok), y si lo es, llama a una función onSuccess con los datos de la respuesta. También maneja respuestas sin contenido (status 204).
const handleOkResponse = (response, onSuccess) => {
	if (!response.ok) {
		return false;
	}

	if (!onSuccess) {
		return true;
	}

	if (response.status === 204) {
		onSuccess();
		return true;
	}

	if (isJson(response)) {
		response.json().then((payload) => onSuccess(payload));
	} else {
		response.blob().then((blob) => onSuccess(blob));
	}

	return true;
};

const handle4xxResponse = (response, onErrors) => {
	if (response.status < 400 || response.status >= 500) {
		return false;
	}

	if (response.status === 401 && reauthenticationCallback) {
		reauthenticationCallback();
		return true;
	}

	if (!isJson(response)) {
		throw new NetworkError();
	}

	if (onErrors) {
		response.json().then((payload) => {
			if (payload.globalError || payload.fieldErrors) {
				onErrors(payload);
			}
		});
	}

	return true;
};

const handleResponse = (response, onSuccess, onErrors) => {
	if (handleOkResponse(response, onSuccess)) {
		return;
	}

	if (handle4xxResponse(response, onErrors)) {
		return;
	}

	throw new NetworkError();
};

export const init = (callback) => (networkErrorCallback = callback);

export const setReauthenticationCallback = (callback) =>
	(reauthenticationCallback = callback);

export const setServiceToken = (serviceToken) =>
	localStorage.setItem(config.SERVICE_TOKEN_NAME, serviceToken); //sesion storage es como localstorage pero se borra al cerrar el navegador

export const getServiceToken = () =>
	localStorage.getItem(config.SERVICE_TOKEN_NAME);

export const removeServiceToken = () =>
	localStorage.removeItem(config.SERVICE_TOKEN_NAME);

export const fetchConfig = (method, body) => {
	const fConfig = {
		method: method,
	};

	if (body) {
		if (body instanceof FormData) {
			fConfig.body = body;
		} else {
			fConfig.headers = { "Content-Type": "application/json" };
			fConfig.body = JSON.stringify(body);
		}
	}

	const serviceToken = getServiceToken();

	if (serviceToken) {
		if (fConfig.headers) {
			fConfig.headers["Authorization"] = `Bearer ${serviceToken}`;
		} else {
			fConfig.headers = { Authorization: `Bearer ${serviceToken}` };
		}
	}

	return fConfig;
};

export const appFetch = (path, options, onSuccess, onErrors) =>
	fetch(`${config.BASE_PATH}${path}`, options)
		.then((response) => handleResponse(response, onSuccess, onErrors))
		.catch(networkErrorCallback);

/* EJEMPLO DE USO

  const method = "POST";
  const requestBody = {
    username: "usuario",
    password: "contraseña",
  };

  const config = fetchConfig(method, requestBody); // usamos fetchConfig para configurar los headers y el body de la request

  appFetch("/api/login", config, onSuccessCallback, onErrorCallback); //Aqui hacemos el appFetch a la ruta que queremos, pasandole la configuracion, y los callbacks de exito y error

*/
