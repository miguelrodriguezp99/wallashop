package es.udc.fi.dc.fd.model.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import es.udc.fi.dc.fd.model.common.exceptions.DuplicateInstanceException;
import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Category;
import es.udc.fi.dc.fd.model.entities.CategoryDao;
import es.udc.fi.dc.fd.model.entities.Notification;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.PostDao;
import es.udc.fi.dc.fd.model.entities.UserDao;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.entities.Users.RoleType;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectLoginException;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPasswordException;
import jakarta.transaction.Transactional;

/**
 * The Class UserServiceTest.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

	@Autowired
	private UserDao userDao;
	@Autowired
	private PostDao postDao;
	@Autowired
	private CategoryDao categoryDao;

	/** The user service. */
	@Autowired
	private UserService userService;
	@Autowired
	private PostService postService;

	private final Long NON_EXISTENT_ID = Long.valueOf(-1);

	Category category1 = new Category("Electronics");

	/**
	 * Creates the user.
	 *
	 * @param userName the user name
	 * @return the user
	 */
	private Users createUser(String userName) {
		return new Users(userName, "password", "firstName", "lastName", userName + "@" + userName + ".com",
				"avatar.png");
	}

	private Post createPost(String title, Users user) {
		return new Post("Mi título", "Mi descripción", "https://example.com", 99.99,
				List.of("imagen1.jpg", "imagen2.jpg"), LocalDateTime.now(), LocalDateTime.now().plusDays(7), category1,
				user, Post.Type.OFFER, true);
	}

	/**
	 * Test sign up and login from id.
	 *
	 * @throws DuplicateInstanceException the duplicate instance exception
	 * @throws InstanceNotFoundException  the instance not found exception
	 */
	@Test
	public void testSignUpAndLoginFromId() throws DuplicateInstanceException, InstanceNotFoundException {

		Users user = createUser("user");

		userService.signUp(user);

		Users loggedInUser = userService.loginFromId(user.getId());

		assertEquals(user, loggedInUser);
		assertEquals(Users.RoleType.USER, user.getRole());

	}

	@Test
	public void testChangeAvatar() throws DuplicateInstanceException, InstanceNotFoundException {

		Users user = createUser("user");

		userService.signUp(user);

		userService.changeAvatar(user.getId(), "AAAAAAA.png");

		assertEquals(user.getAvatar(), "AAAAAAA.png");

	}

	@Test
	public void testUserAlreadyExist() throws DuplicateInstanceException {

		Users user = createUser("user");

		userService.signUp(user);

		assertThrows(DuplicateInstanceException.class, () -> userService.signUp(user));

	}

	@Test
	public void testIncorrectLoginUser() throws DuplicateInstanceException {

		Users user = createUser("user");

		userService.signUp(user);

		assertThrows(IncorrectLoginException.class, () -> userService.login("Moris", "password"));

	}

	@Test
	public void testIncorrectLoginPassword() throws DuplicateInstanceException {

		Users user = createUser("user");

		userService.signUp(user);

		assertThrows(IncorrectLoginException.class, () -> userService.login("user", "Moris"));

	}

	@Test
	public void testIncorrectOldPassword() throws DuplicateInstanceException {

		Users user = createUser("user");

		userService.signUp(user);

		assertThrows(IncorrectPasswordException.class, () -> userService.changePassword(user.getId(), "user", "Moris"));

	}

	@Test
	public void testChangeAvatarNotUser() throws DuplicateInstanceException, InstanceNotFoundException {

		Users user = createUser("user");

		userService.signUp(user);

		assertThrows(InstanceNotFoundException.class, () -> userService.changeAvatar(NON_EXISTENT_ID, "AAAAAAA.png"));

	}

	@Test
	public void testGetUserNotifications() throws Exception,
	InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		categoryDao.save(category1);

		Post post = createPost("post", user);
		postDao.save(post);
		
		postService.createComment(user2.getId(), post.getId(), "hola");
		
		List<Notification> userNotifications = userService.getUserNotifications(user.getId());

		// assertEquals(userNotifications.get(0),
		// userService.getNotification(Long.valueOf("1")));
		assertEquals(userNotifications.get(0).getUser().getId(), user.getId());
	}

	@Test
	public void testDeleteNotificationInvalidId() throws Exception, InstanceNotFoundException {

		assertThrows(InstanceNotFoundException.class, () -> userService.deleteNotification(NON_EXISTENT_ID));
	}

	@Test
	public void testGetNotificationInvalidId() throws Exception, InstanceNotFoundException {

		assertThrows(InstanceNotFoundException.class, () -> userService.getNotification(NON_EXISTENT_ID));
	}

	@Test
	public void testGetUserNotificationsInvalidId() throws Exception, InstanceNotFoundException {

		assertThrows(InstanceNotFoundException.class, () -> userService.getUserNotifications(NON_EXISTENT_ID));
	}

	@Test
	public void testCreateNotificationFollowExpiredPost() throws Exception, InstanceNotFoundException{

		Users user1 = createUser("user");
		user1.setRole(RoleType.USER);
		userDao.save(user1);

		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		categoryDao.save(category1);

		Post post = createPost("post", user1);
		postDao.save(post);

		postService.createFollow(user2.getId(),post.getId());
		post.setExpirationDate(LocalDateTime.now().minusDays(2));
		int nots = userService.getUserNotifications(user2.getId()).size();
		assertEquals(nots,1);;
	}
	
	
	
	
	
	
}
