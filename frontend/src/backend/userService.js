import {
  fetchConfig,
  appFetch,
  setServiceToken,
  getServiceToken,
  removeServiceToken,
  setReauthenticationCallback,
} from "./appFetch";

const processLoginSignUp = (authenticatedUser, reauthenticationCallback, onSuccess) => {
  setServiceToken(authenticatedUser.serviceToken);
  setReauthenticationCallback(reauthenticationCallback);
  onSuccess(authenticatedUser);
}

export const login = (
  userName,
  password,
  onSuccess,
  onErrors,
  reauthenticationCallback
) => {
  console.log(userName, password, onSuccess, onErrors, reauthenticationCallback)
  appFetch(
    "/users/login",
    fetchConfig("POST", { userName, password }),
    (authenticatedUser) => {
      processLoginSignUp(authenticatedUser, reauthenticationCallback, onSuccess);
    },
    onErrors
  );
}


export const tryLoginFromServiceToken = (
  onSuccess,
  reauthenticationCallback
) => {
  const serviceToken = getServiceToken();

  if (!serviceToken) {
    onSuccess();
    return;
  }

  setReauthenticationCallback(reauthenticationCallback);

  appFetch(
    "/users/loginFromServiceToken",
    fetchConfig("POST"),
    (authenticatedUser) => onSuccess(authenticatedUser),
    () => removeServiceToken()
  );
};

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => {
  appFetch(
    "/users/signUp",
    fetchConfig("POST", user),
    (authenticatedUser) => {
      processLoginSignUp(authenticatedUser, reauthenticationCallback, onSuccess);
    },
    onErrors
  );
};

export const logout = () => removeServiceToken();

export const updateProfile = ( user, onSuccess, onErrors) =>
  appFetch(`/users/${user.id}`, fetchConfig("PUT", user), onSuccess, onErrors);

export const changePassword = (
  id,
  oldPassword,
  newPassword,
  onSuccess,
  onErrors
) =>
  appFetch(
    `/users/${id}/changePassword`,
    fetchConfig("POST", { oldPassword, newPassword }),
    onSuccess,
    onErrors
  );


export const changeAvatar = (
  userId,
  url,
  onSuccess,
  onErrors
) => {
  appFetch(
    `/users/${userId}/changeAvatar`,
    fetchConfig("POST", { url }),
    onSuccess,
    onErrors
  );
}

export const getNotifications = (userId, onSuccess, onErrors) => {
	appFetch(
    	`/users/${userId}/notifications`,
    	fetchConfig("GET"),
    	(notifications) =>{
			onSuccess(notifications);
		},
    	onErrors
  	);
};
export const deleteNotification = (userId, notificationId, onSuccess, onErrors) => {
	appFetch(
		`/users/${userId}/notification/${notificationId}`, 
		fetchConfig("DELETE"), 
		onSuccess, 
		onErrors
	);
};
