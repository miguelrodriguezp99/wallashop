package es.udc.fi.dc.fd.model.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.udc.fi.dc.fd.model.common.exceptions.DuplicateInstanceException;
import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.entities.Follow;
import es.udc.fi.dc.fd.model.entities.FollowDao;
import es.udc.fi.dc.fd.model.entities.Notification;
import es.udc.fi.dc.fd.model.entities.NotificationDao;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.PostDao;
import es.udc.fi.dc.fd.model.entities.UserDao;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectLoginException;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPasswordException;

/**
 * The Class UserServiceImpl.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

	/** The permission checker. */
	@Autowired
	private PermissionChecker permissionChecker;

	/** The password encoder. */
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	/** The user dao. */
	@Autowired
	private UserDao userDao;
	
	/** The follow dao. */
	@Autowired
	private PostDao postDao;

	/** The notification dao. */
	@Autowired
	private NotificationDao notificationDao;
	
	/** The follow dao. */
	@Autowired
	private FollowDao followDao;
	
	/**
	 * Sign up.
	 *
	 * @param user the user
	 * @throws DuplicateInstanceException the duplicate instance exception
	 */
	@Override
	public void signUp(Users user) throws DuplicateInstanceException {

		if (userDao.existsByUserName(user.getUserName())) {
			throw new DuplicateInstanceException("project.entities.user", user.getUserName());
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setRole(Users.RoleType.USER);

		userDao.save(user);

	}

	/**
	 * Login.
	 *
	 * @param userName the user name
	 * @param password the password
	 * @return the user
	 * @throws IncorrectLoginException the incorrect login exception
	 */
	@Override
	@Transactional(readOnly = true)
	public Users login(String userName, String password) throws IncorrectLoginException {

		Optional<Users> user = userDao.findByUserName(userName);

		if (!user.isPresent()) {
			throw new IncorrectLoginException(userName, password);
		}

		if (!passwordEncoder.matches(password, user.get().getPassword())) {
			throw new IncorrectLoginException(userName, password);
		}
		
		return user.get();

	}

	/**
	 * Login from id.
	 *
	 * @param id the id
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	@Override
	@Transactional(readOnly = true)
	public Users loginFromId(Long id) throws InstanceNotFoundException {
		return permissionChecker.checkUser(id);
	}

	/**
	 * Update profile.
	 *
	 * @param id        the id
	 * @param firstName the first name
	 * @param lastName  the last name
	 * @param email     the email
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	@Override
	public Users updateProfile(Long id, String firstName, String lastName, String email)
			throws InstanceNotFoundException {

		Users user = permissionChecker.checkUser(id);

		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setEmail(email);

		return user;

	}

	/**
	 * Change password.
	 *
	 * @param id          the id
	 * @param oldPassword the old password
	 * @param newPassword the new password
	 * @throws InstanceNotFoundException  the instance not found exception
	 * @throws IncorrectPasswordException the incorrect password exception
	 */
	@Override
	public void changePassword(Long id, String oldPassword, String newPassword)
			throws InstanceNotFoundException, IncorrectPasswordException {

		Users user = permissionChecker.checkUser(id);

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new IncorrectPasswordException();
		} else {
			user.setPassword(passwordEncoder.encode(newPassword));
		}

	}



		/**
	 * Change Avatar.
	 *
	 * @param id          the id
	 * @param Avatar the new Avatar
	 * @throws InstanceNotFoundException  the instance not found exception
	 */
	@Override
	public void changeAvatar(Long id, String newAvatar)
			throws InstanceNotFoundException {

		Users user = permissionChecker.checkUser(id);
		user.setAvatar(newAvatar);
	}

    //------ Notification
    
    public List<Notification> getUserNotifications(Long userId) throws InstanceNotFoundException {
        Users user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));

		createNotificationFollowExpiredPost(user);

        return notificationDao.findAllByUser(user);
    }

    public void deleteNotification(Long notificationId) throws InstanceNotFoundException {
    	Notification notification = notificationDao.findById(notificationId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.notification", notificationId));

        notificationDao.delete(notification);
    }
    
    public Notification getNotification(Long notificationId) throws InstanceNotFoundException {
    	Notification notification = notificationDao.findById(notificationId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.notification", notificationId));

        return notification;
    }
    
	private void createNotificationFollowExpiredPost(Users user){
		
		List<Follow> follows = followDao.findAllByUser(user);
		Integer lenght = follows.size();
		for (Integer i = 0; i<lenght; i++) {
			
			Post post = postDao.findById(follows.get(i).getPost().getId()).get();

			if (!follows.get(i).getExpired()&&post.getExpirationDate().isBefore(LocalDateTime.now())) {
				Notification notification = new Notification(user, post);
				notificationDao.save(notification);
				
				follows.get(i).setExpired(true);
			}
		}
	}

}
