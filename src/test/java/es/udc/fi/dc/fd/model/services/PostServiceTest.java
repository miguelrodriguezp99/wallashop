package es.udc.fi.dc.fd.model.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import es.udc.fi.dc.fd.model.common.exceptions.DuplicateInstanceException;
import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Category;
import es.udc.fi.dc.fd.model.entities.CategoryDao;
import es.udc.fi.dc.fd.model.entities.Comment;
import es.udc.fi.dc.fd.model.entities.CommentDao;
import es.udc.fi.dc.fd.model.entities.Follow;
import es.udc.fi.dc.fd.model.entities.Notification;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.PostDao;
import es.udc.fi.dc.fd.model.entities.Rate;
import es.udc.fi.dc.fd.model.entities.RateDao;
import es.udc.fi.dc.fd.model.entities.UserDao;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.entities.Users.RoleType;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPriceException;
import jakarta.transaction.Transactional;

/**
 * The Class PostServiceTest.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PostServiceTest {

	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private CommentDao commentDao;
	@Autowired
	private PostDao postDao;
	@Autowired
	private RateDao rateDao;

	/** The services. */
	@Autowired
	private UserService userService;
	@Autowired
	private PostService postService;

	Category category1 = new Category("Electronics");

	private final Long NON_EXISTENT_ID = Long.valueOf(-1);

	private Users createUser(String userName) {
		return new Users(userName, "password", "firstName", "lastName", userName + "@" + userName + ".com",
				"avatar.png");
	}

	private Post createPost2(String title, Users user) {
		return new Post(title, "desc", "url", 15.21, new ArrayList<>(), LocalDateTime.now(), LocalDateTime.now(),
				category1, user, Post.Type.OFFER, true);
	}

	private Comment createComment(Users user, Post post) {
		return new Comment(user, post, "text");
	}

	private Post createPost(Users user, Category c1) {
		return new Post("Tittle", "Description", "http://www.ejemplo.com", 10.00,
				Arrays.asList("image1.jpg", "image2.jpg"), LocalDateTime.now(), LocalDateTime.now(), c1, user,
				Post.Type.OFFER, true);
	}

	@Test
	public void testCreateAndGetLatestPost()
			throws DuplicateInstanceException, InstanceNotFoundException, IncorrectPriceException {

		categoryDao.save(category1);
		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Post postTest = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
				LocalDateTime.now().plusDays(1));

		Post postFindedTest = postService.getLatestPosts(0, 1).get().findFirst().get();

		assertEquals(postTest.getId(), postFindedTest.getId());
		assertEquals(postTest.getTitle(), postFindedTest.getTitle());
		assertEquals(postTest.getDescription(), postFindedTest.getDescription());
		assertEquals(postTest.getUrl(), postFindedTest.getUrl());
		assertEquals(postTest.getPrice(), postFindedTest.getPrice());
		assertEquals(postTest.getImages(), postFindedTest.getImages());
		assertEquals(postTest.getCategory(), postFindedTest.getCategory());

	}

	@Test
	public void testCreatePostByNotExistentUserId() throws Exception, InstanceNotFoundException {

		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createPost(NON_EXISTENT_ID, "title", "description", "url", 29.99,
						List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
						LocalDateTime.now().plusDays(1)));

	}

	@Test
	public void testCreatePostByNotExistentCategoryId() throws Exception, InstanceNotFoundException {
		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createPost(user.getId(), "title", "description", "url", 29.99,
						List.of("imagen1.jpg", "imagen2.jpg"), NON_EXISTENT_ID, Post.Type.COUPON, "A123",
						LocalDateTime.now().plusDays(1)));

	}

	@Test
	public void testCreatePostIncorrectPrice() throws Exception, InstanceNotFoundException {
		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createPost(user.getId(), "title", "description", "url", (double) -1,
						List.of("imagen1.jpg", "imagen2.jpg"), NON_EXISTENT_ID, Post.Type.COUPON, "A123",
						LocalDateTime.now().plusDays(1)));
	}

	@Test
	public void testCreateCommentAndNotification() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		String text = "text";

		Comment comment = postService.createComment(user2.getId(), post.getId(), text);

		List<Notification> userNotifications = userService.getUserNotifications(user.getId());

		assertEquals(comment.getUser().getId(), user2.getId());
		assertEquals(comment.getPost().getId(), post.getId());
		assertEquals(comment.getText(), text);

		assertEquals(userNotifications.get(0).getUser().getId(), user.getId());
		assertEquals(userNotifications.get(0).getPost().getId(), post.getId());
		assertEquals(userNotifications.get(0).getComment().getId(), comment.getId());
	}

	@Test
	public void testCreateCommentAndNotificationIncorrectUser() throws Exception, InstanceNotFoundException {
		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createComment(NON_EXISTENT_ID, post.getId(), "text"));
	}

	@Test
	public void testCreateCommentAndNotificationIncorrectPost() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createComment(user.getId(), NON_EXISTENT_ID, "text"));
	}

	@Test
	public void testReplyCommentAndNotification() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		Users user3 = createUser("user3");
		user3.setRole(RoleType.USER);
		userDao.save(user3);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		String text = "text";

		Comment commentP = createComment(user2, post);
		commentDao.save(commentP);

		Comment comment = postService.replyComment(user3.getId(), post.getId(), commentP.getId(), text);

		List<Notification> userNotifications = userService.getUserNotifications(user2.getId());

		assertEquals(comment.getUser().getId(), user3.getId());
		assertEquals(comment.getPost().getId(), post.getId());
		assertEquals(comment.getParentComment().getId(), commentP.getId());
		assertEquals(comment.getText(), text);

		assertEquals(userNotifications.get(0).getUser().getId(), user2.getId());
		assertEquals(userNotifications.get(0).getPost().getId(), post.getId());
		assertEquals(userNotifications.get(0).getComment().getId(), comment.getId());
		assertEquals(userNotifications.get(0).getParentComment().getId(), commentP.getId());
	}

	@Test
	public void testReplyCommentAndNotificationIncorrectUser() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		Comment commentP = createComment(user, post);
		commentDao.save(commentP);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.replyComment(NON_EXISTENT_ID, post.getId(), commentP.getId(), "text"));
	}

	@Test
	public void testReplyCommentAndNotificationIncorrectPost() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		Comment commentP = createComment(user, post);
		commentDao.save(commentP);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.replyComment(user.getId(), NON_EXISTENT_ID, commentP.getId(), "text"));
	}

	@Test
	public void testReplyCommentAndNotificationIncorrectComment() throws Exception, InstanceNotFoundException {

		Users user = createUser("user");
		user.setRole(RoleType.USER);
		userDao.save(user);

		categoryDao.save(category1);

		Post post = createPost2("post", user);
		postDao.save(post);

		Comment commentP = createComment(user, post);
		commentDao.save(commentP);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.replyComment(user.getId(), post.getId(), NON_EXISTENT_ID, "text"));
	}

	@Test
	public void testUpdatePost() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		Post post = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
				LocalDateTime.now().plusDays(1));

		Rate rate = new Rate(user, post, true);
		rateDao.save(rate);

		List<String> imageList = new ArrayList<>();
		imageList.add("image1");

		postService.updatePost(user.getId(), post.getId(), "NewTitle", "newDescription", "newUrl", (double) 20,
				imageList, false);
		postDao.save(post);

		assertEquals("NewTitle", post.getTitle());
		assertEquals("newDescription", post.getDescription());
		assertEquals("newUrl", post.getUrl());
		assertTrue(imageList.equals(post.getImages()));
// assertEquals(false, rate.getRate());
	}

	@Test
	public void testFindCategories() {
		Category c1 = new Category("Electronics");
		categoryDao.save(c1);
		Category c2 = new Category("Electronics");
		categoryDao.save(c2);
		Category c3 = new Category("Electronics");
		categoryDao.save(c3);

		List<Category> testList = postService.getCategories();

		assertEquals(categoryDao.findAll(), testList);
	}

	@Test
	public void testRatePost() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		Post post = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
				LocalDateTime.now().plusDays(1));

		Rate rate = new Rate(user, post, true);
		rateDao.save(rate);

		assertEquals(rate.getRate(), postService.getUserRate(user.getId(), post.getId()).getRate());
	}

	@Test
	public void testGetPostRates() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Users user2 = createUser("name2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		Post post = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
				LocalDateTime.now().plusDays(1));

		List<Rate> rateList = new ArrayList<Rate>();

		Rate r1 = new Rate(user, post, true);
		rateDao.save(r1);
		Rate r2 = new Rate(user2, post, false);
		rateDao.save(r2);

		rateList.add(r1);
		rateList.add(r2);

		assertEquals(rateList, postService.getPostRates(post.getId()));
	}

	@Test
	public void testGetNPostRates() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Users user2 = createUser("name2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);

		Users user3 = createUser("name3");
		user3.setRole(RoleType.USER);
		userDao.save(user3);

		Users user4 = createUser("name4");
		user4.setRole(RoleType.USER);
		userDao.save(user4);

		Category category1 = new Category("Electronics");
		categoryDao.save(category1);

		Post post = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), category1.getId(), Post.Type.COUPON, "A123",
				LocalDateTime.now().plusDays(1));

		Rate r1 = new Rate(user, post, true);
		rateDao.save(r1);
		Rate r2 = new Rate(user2, post, false);
		rateDao.save(r2);
		Rate r3 = new Rate(user3, post, true);
		rateDao.save(r3);
		Rate r4 = new Rate(user4, post, false);
		rateDao.save(r4);

		assertEquals(2, postService.getPostNRates(post.getId()).getTrueRatesCount());
		assertEquals(2, postService.getPostNRates(post.getId()).getFalseRatesCount());
	}

	@Test
	public void testGetLatestPost() throws InstanceNotFoundException, IncorrectPriceException {

		postDao.deleteAll();

		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);
		Category c1 = new Category("Electronics");
		categoryDao.save(c1);

		Post p1 = postService.createPost(user.getId(), "title", "description", "url", 29.99,
				List.of("imagen1.jpg", "imagen2.jpg"), c1.getId(), Post.Type.OFFER, null,
				LocalDateTime.now().plusDays(1));
		Post p2 = postService.createPost(user.getId(), "Title2", "description", "url", 16.67, new ArrayList<>(),
				c1.getId(), Post.Type.OFFER, null, LocalDateTime.now().plusDays(1));
		Post p3 = postService.createPost(user.getId(), "Title3", "description", "url", 16.67, new ArrayList<>(),
				c1.getId(), Post.Type.COUPON, "A123", LocalDateTime.now().plusDays(1));

		Page<Post> result = postService.getLatestPosts(0, 3);

		assertEquals(3, result.getTotalElements());
		assertEquals(3, result.getNumberOfElements());
		assertEquals(1, result.getTotalPages());
		assertEquals(p1, result.getContent().get(2));
		assertEquals(p2, result.getContent().get(1));
		assertEquals(p3, result.getContent().get(0));
	}

	@Test
	public void testSetOfferCouponCodeNotAllowed() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);

		Category c1 = new Category("Electronics");
		categoryDao.save(c1);

		Post couponPost = postService.createPost(user.getId(), "Titleeee", "description", "url", 16.67,
				new ArrayList<>(), c1.getId(), Post.Type.OFFER, "A123", LocalDateTime.now().plusDays(1));
		postDao.save(couponPost);

		assertThrows(InstanceNotFoundException.class,
				() -> postService.createPost(user.getId(), "Title", "description", "url", 16.67, new ArrayList<>(),
						user.getId(), Post.Type.OFFER, "A123", LocalDateTime.now().plusDays(1)));
	}

	@Test
	public void testDeletePostWithCommentsAndRates() throws InstanceNotFoundException, IncorrectPriceException {

		postDao.deleteAll();
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);
		Category c1 = new Category("Electronics");
		categoryDao.save(c1);
		Post post = createPost(user, c1);
		postDao.save(post);
		Comment comm = postService.createComment(user.getId(), post.getId(), "test comment");
		commentDao.save(comm);

		assertThrows(InstanceNotFoundException.class, () -> postService.deletePost(post.getId(), NON_EXISTENT_ID));

		postService.ratePost(user.getId(), post.getId(), true);
		postService.deletePost(post.getId(), user.getId());

		Page<Post> testPost = postService.getLatestPosts(0, 1);

		assertEquals(0, testPost.get().count());
	}

	@Test
	public void testCreateComment() throws InstanceNotFoundException, IncorrectPriceException {
		Users user = createUser("name");
		user.setRole(RoleType.USER);
		userDao.save(user);
		Category c1 = new Category("Electronics");
		categoryDao.save(c1);
		Post post = createPost(user, c1);
		postDao.save(post);

		Comment comm = postService.createComment(user.getId(), post.getId(), "comment test");
		assertEquals(user, comm.getUser());
		assertEquals(post, comm.getPost());
		assertEquals("comment test", comm.getText());

	}

	@Test
	public void testCreateFollow() throws InstanceNotFoundException {
		Users user1 = createUser("user1");
		user1.setRole(RoleType.USER);
		userDao.save(user1);
		
		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);
		
		categoryDao.save(category1);
		
		Post post = createPost2("post1",user1);
		postDao.save(post);
		
		Follow follow = postService.createFollow(user2.getId(),post.getId());
		
		assertEquals(user2, follow.getUser());
		assertEquals(post, follow.getPost());
	}
	
	@Test
	public void testCreateFollowInvalidUser() throws InstanceNotFoundException {
		Users user1 = createUser("user1");
		user1.setRole(RoleType.USER);
		userDao.save(user1);
		
		categoryDao.save(category1);
		
		Post post = createPost2("post1",user1);
		postDao.save(post);
		
		assertThrows(InstanceNotFoundException.class, () ->
		postService.createFollow(NON_EXISTENT_ID,post.getId()));
	}
	
	@Test
	public void testCreateFollowInvalidPost() throws InstanceNotFoundException {
		Users user1 = createUser("user1");
		user1.setRole(RoleType.USER);
		userDao.save(user1);
		
		assertThrows(InstanceNotFoundException.class, () ->
		postService.createFollow(user1.getId() ,NON_EXISTENT_ID));
	}
	
	@Test
	public void testCreateFollowOwnPost() throws InstanceNotFoundException {
		Users user1 = createUser("user1");
		user1.setRole(RoleType.USER);
		userDao.save(user1);
		
		categoryDao.save(category1);
		
		Post post = createPost2("post1",user1);
		postDao.save(post);
	
		assertThrows(InstanceNotFoundException.class, () ->
		postService.createFollow(user1.getId() ,post.getId()));
	}
	
	@Test
	public void testDeleteFollow() throws InstanceNotFoundException {
		Users user1 = createUser("user1");
		user1.setRole(RoleType.USER);
		userDao.save(user1);
		
		Users user2 = createUser("user2");
		user2.setRole(RoleType.USER);
		userDao.save(user2);
		
		categoryDao.save(category1);
		
		Post post = createPost2("post1",user1);
		postDao.save(post);
		
		Follow follow = postService.createFollow(user2.getId(),post.getId());
		
		Long fid = follow.getId();
		
		postService.deleteFollow(fid);
		
		List<Follow> follows = postService.getPostFollows(post.getId());
		
		assertEquals(0, follows.size());
		
	}
	
	@Test
	public void testDeleteInvalidFollow() throws InstanceNotFoundException {
		assertThrows(InstanceNotFoundException.class, () ->
		postService.deleteFollow(NON_EXISTENT_ID));
		
	}
	
	@Test
	public void testGetFollowsInvalidPost() throws InstanceNotFoundException {
		assertThrows(InstanceNotFoundException.class, () ->
		postService.getPostFollows(NON_EXISTENT_ID));	
	}
	
	
}
