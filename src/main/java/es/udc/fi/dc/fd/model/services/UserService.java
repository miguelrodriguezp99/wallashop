package es.udc.fi.dc.fd.model.services;

import java.util.List;

import es.udc.fi.dc.fd.model.common.exceptions.DuplicateInstanceException;
import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Notification;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectLoginException;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPasswordException;

/**
 * The Interface UserService.
 */
public interface UserService {
	
	/**
	 * Sign up.
	 *
	 * @param user the user
	 * @throws DuplicateInstanceException the duplicate instance exception
	 */
	void signUp(Users user) throws DuplicateInstanceException;
	
	/**
	 * Login.
	 *
	 * @param userName the user name
	 * @param password the password
	 * @return the user
	 * @throws IncorrectLoginException the incorrect login exception
	 */
	Users login(String userName, String password) throws IncorrectLoginException;
	
	/**
	 * Login from id.
	 *
	 * @param id the id
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	Users loginFromId(Long id) throws InstanceNotFoundException;
	
	/**
	 * Update profile.
	 *
	 * @param id the id
	 * @param firstName the first name
	 * @param lastName the last name
	 * @param email the email
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	Users updateProfile(Long id, String firstName, String lastName, String email) throws InstanceNotFoundException;
	
	/**
	 * Change password.
	 *
	 * @param id the id
	 * @param oldPassword the old password
	 * @param newPassword the new password
	 * @throws InstanceNotFoundException the instance not found exception
	 * @throws IncorrectPasswordException the incorrect password exception
	 */
	void changePassword(Long id, String oldPassword, String newPassword)
		throws InstanceNotFoundException, IncorrectPasswordException;

	
	void changeAvatar(Long id, String url) throws InstanceNotFoundException;

    List<Notification> getUserNotifications(Long userId) throws InstanceNotFoundException;
    
    void deleteNotification(Long notificationId) throws InstanceNotFoundException;
    
    Notification getNotification(Long notificationId) throws InstanceNotFoundException;
}