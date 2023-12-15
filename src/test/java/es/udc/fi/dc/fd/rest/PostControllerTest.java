package es.udc.fi.dc.fd.rest;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Category;
import es.udc.fi.dc.fd.model.entities.CategoryDao;
import es.udc.fi.dc.fd.model.entities.Comment;
import es.udc.fi.dc.fd.model.entities.CommentDao;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.Post.Type;
import es.udc.fi.dc.fd.model.entities.PostDao;
import es.udc.fi.dc.fd.model.entities.Rate;
import es.udc.fi.dc.fd.model.entities.UserDao;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.entities.Users.RoleType;
import es.udc.fi.dc.fd.model.services.PostService;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectLoginException;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPriceException;
import es.udc.fi.dc.fd.rest.controllers.PostController;
import es.udc.fi.dc.fd.rest.controllers.UserController;
import es.udc.fi.dc.fd.rest.dtos.AuthenticatedUserDto;
import es.udc.fi.dc.fd.rest.dtos.CategoryConverter;
import es.udc.fi.dc.fd.rest.dtos.CategoryDto;
import es.udc.fi.dc.fd.rest.dtos.CommentConverter;
import es.udc.fi.dc.fd.rest.dtos.CommentDto;
import es.udc.fi.dc.fd.rest.dtos.LoginParamsDto;
import es.udc.fi.dc.fd.rest.dtos.PostConverter;
import es.udc.fi.dc.fd.rest.dtos.PostDto;
import es.udc.fi.dc.fd.rest.dtos.UserConversor;

/**
 * The Class UserControllerTest.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PostControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	@Autowired
	private PostDao postDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private CommentDao commentDao;
	@Autowired
	private UserController userController;
	@Autowired
	private ObjectMapper objectMapper;
	@InjectMocks
	private PostController postController;
	@Autowired
	private PostService postService;

	private final static String PASSWORD = "password";

	@Test
	public void testGetLatestPosts_Ok() throws Exception {
		mockMvc.perform(get("/api/posts/").param("page", "0").param("size", "9")).andExpect(status().isOk());
	}

	@Test
	public void testGetCategories_Ok() throws Exception {
		CategoryDto categoryDto = new CategoryDto();
		categoryDto.setName("Electronics");
		ObjectMapper mapper = new ObjectMapper();

		mockMvc.perform(get("/api/posts/categories").contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsBytes(categoryDto))).andExpect(status().isOk());

	}

	@Test
	public void testPost_Created() throws Exception {

		Users entityUser = createUser();
		userDao.save(entityUser);
		AuthenticatedUserDto authenticatedUser = createAuthenticatedUser(entityUser);

		Category c1 = new Category("Electronics");
		categoryDao.save(c1);

		Category c2 = new Category("Art");
		categoryDao.save(c2);

		PostDto postDto = new PostDto();
		postDto.setTitle("Test Post");
		postDto.setDescription("This is a test post.");
		postDto.setUrl("http://example.com");
		postDto.setPrice(10.0);
		postDto.setCategory(CategoryConverter.toDto(c1));
		postDto.setType("COUPON");
		postDto.setCouponCode("A123");
		postDto.setActive(true);

		ObjectMapper mapper = new ObjectMapper();

// Testing if post is created successfully
		mockMvc.perform(post("/api/posts/").header("Authorization", "Bearer " + authenticatedUser.getServiceToken())
				.contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsBytes(postDto)))
				.andExpect(status().isCreated());

	}

	@Test
	public void testDeletePost_No_Content() throws Exception {

		Users entityUser = createUser();
		userDao.save(entityUser);
		AuthenticatedUserDto authenticatedUser = createAuthenticatedUser(entityUser);

		Post post = new Post();
		Category c1 = new Category("Electronics");
		categoryDao.save(c1);

		post.setTitle("Test Post");
		post.setDescription("This is a test post.");
		post.setUrl("http://example.com");
		post.setPrice(10.0);
		post.setCategory(c1);
		post.setType(Type.COUPON);
		post.setCouponCode("A123");
		post.setActive(true);
		post.setUser(entityUser);
		post.setCreationDate(LocalDateTime.now());
		postDao.save(post);

		mockMvc.perform(delete("/api/posts/{postId}", post.getId())
				.header("userId", String.valueOf(authenticatedUser.getUserDto().getId()))
				.header("Authorization", "Bearer " + authenticatedUser.getServiceToken()))
				.andExpect(status().isNoContent());
	}

// @Test
// public void testUpdatePost_Ok() throws Exception {
// Users user = createUser();
// userDao.save(user);
//
// AuthenticatedUserDto auth = createAuthenticatedUser(user);
//
// Category category1 = new Category("Electronics");
// categoryDao.save(category1);
//
// Post post = createPost(user, category1);
//
// PostDto dto = PostConverter.toDto(post);
//
// dto.setTitle("new title");
// dto.setDescription("new description");
// dto.setUrl("new url");
// dto.setPrice(20.05);
// dto.setCategory(CategoryConverter.toDto(category1));
// dto.setType("COUPON");
// dto.setCouponCode("A111");
// dto.setActive(false);
//
// ObjectMapper mapper = new ObjectMapper();
//
// mockMvc.perform(
// put("/api/posts/{postId}", dto.getId()).header("Authorization", "Bearer "
//	+
// auth.getServiceToken())
//
//	.contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsBytes(dto)))
// .andExpect(status().isCreated());
// }

	@Test
	public void testRatePost_Ok() throws Exception {
		Users user = createUser();
		userDao.save(user);
		AuthenticatedUserDto auth = createAuthenticatedUser(user);

		Category category = new Category("Electronics");
		categoryDao.save(category);

		Post post = createPost(user, category);
		postDao.save(post);

		Rate rate = new Rate(user, post, true);
		mockMvc.perform(post("/api/posts/{postId}/like/{rate}", post.getId(), rate.toString())
				.header("rate", Boolean.parseBoolean(rate.toString()))
				.header("userId", String.valueOf(auth.getUserDto().getId()))
				.header("Authorization", "Bearer " + auth.getServiceToken())).andExpect(status().isOk());
	}

	@Test
	public void testGetPostNRates_Ok() throws Exception {

		postDao.deleteAll();

		Users user1 = createUser();
		userDao.save(user1);
		Users user2 = createUser();
		userDao.save(user2);

		Category category = new Category("Electronics");
		categoryDao.save(category);

		Post post = createPost(user1, category);
		postDao.save(post);

		postService.ratePost(user1.getId(), post.getId(), true);
		postService.ratePost(user2.getId(), post.getId(), false);

		mockMvc.perform(get("/api/posts/nrates/{postId}", post.getId())).andExpect(status().isOk())
				.andExpect(jsonPath("$.trueRatesCount").value(1)).andExpect(jsonPath("$.falseRatesCount").value(1));
	}

	@Test
	public void testGetUserRates_Ok() throws Exception {
		Users user = createUser();
		userDao.save(user);
		AuthenticatedUserDto auth = createAuthenticatedUser(user);

		Category c = new Category("Electronics");
		categoryDao.save(c);

		Post p1 = createPost(user, c);
		postDao.save(p1);

		postService.ratePost(user.getId(), p1.getId(), true);

		mockMvc.perform(get("/api/posts/userrates/{postId}", p1.getId()).header("Authorization",
				"Bearer " + auth.getServiceToken())).andExpect(jsonPath("$.rate").value(true))
				.andExpect(status().isOk());
	}

	@Test
	public void testGetComments_Ok() throws Exception {

		Users u = createUser();
		userDao.save(u);
		Category c = new Category("Art");
		categoryDao.save(c);
		Post post = createPost(u, c);
		postDao.save(post);

		Comment c1 = new Comment(u, post, "test comment");
		commentDao.save(c1);

		List<Comment> comments = new ArrayList<>();

		PostService postService1 = mock(PostService.class);
		when(postService1.getComments()).thenReturn(comments);

		mockMvc.perform(get("/api/posts/comments")).andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].text").value("test comment")).andExpect(status().isOk());

//
//mockMvc.perform(get("/api/posts/comments")).andExpect(jsonPath("$",
//hasSize(1)))
//.andExpect(jsonPath("$[0].text").value("test"
//comment")).andExpect(status().isOk());
	}

	@Test
	public void testCreateComment_Created() throws Exception {
		Users user = createUser();
		userDao.save(user);
		AuthenticatedUserDto auth = createAuthenticatedUser(user);

		Category c1 = new Category("Art");
		categoryDao.save(c1);
		Post post = createPost(user, c1);
		postDao.save(post);

		CommentDto dto = new CommentDto(UserConversor.toUserDto(user), PostConverter.toDto(post));
		dto.setText("test");

		String commentJson = objectMapper.writeValueAsString(dto);

// Test to create a new comment
		mockMvc.perform(post("/api/posts/{postId}/comment", post.getId())
				.header("Authorization", "Bearer " + auth.getServiceToken()).content(commentJson)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isCreated()).andReturn();

	}

	@Test
	public void testDeleteComment_NoContent() throws Exception {
		Users user = createUser();
		userDao.save(user);
		AuthenticatedUserDto auth = createAuthenticatedUser(user);
		Category c1 = new Category("Art");
		categoryDao.save(c1);
		Post post = createPost(user, c1);
		postDao.save(post);

		Comment comment = new Comment(user, post, "test");
		commentDao.save(comment);

		mockMvc.perform(delete("/api/posts/{postId}/comment/{commentId}", post.getId(), comment.getId())
				.header("Authorization", "Bearer " + auth.getServiceToken()).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());
	}

	@Test
	public void testReplyComment_Created() throws Exception {

		Users user2 = createUser();
		userDao.save(user2);
		AuthenticatedUserDto auth2 = createAuthenticatedUser(user2);
		Category c1 = new Category("Art");
		categoryDao.save(c1);
		Post post = createPost(user2, c1);
		postDao.save(post);

		Comment comm = new Comment(user2, post, "comment");
		commentDao.save(comm);

		CommentDto replyDto = new CommentDto(UserConversor.toUserDto(user2), PostConverter.toDto(post), comm.getId());
		replyDto.setText("reply test");

		String commentJson = objectMapper.writeValueAsString(replyDto);

		mockMvc.perform(post("/api/posts/{postId}/comment/{commentParentId}/reply", post.getId(), comm.getId())
				.header("Authorization", "Bearer " + auth2.getServiceToken()).content(commentJson)
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isCreated()).andReturn();

	}

	@PostMapping("{postId}/comment/{commentParentId}/reply")
	public ResponseEntity<CommentDto> replyComment(@RequestAttribute Long userId, @PathVariable Long postId,
			@PathVariable Long commentParentId, @RequestBody CommentDto comment) throws InstanceNotFoundException {
		Comment createdComment = postService.replyComment(userId, postId, commentParentId, comment.getText());

		CommentDto createdCommentDto = CommentConverter.toDto(createdComment);

		return new ResponseEntity<>(createdCommentDto, HttpStatus.CREATED);
	}

	// ----- AUXILIAR FUNCTIONS
	// ------------------------------------------------------------------------------------

	private AuthenticatedUserDto createAuthenticatedUser(Users user) throws IncorrectLoginException {
		user.setPassword(passwordEncoder.encode(PASSWORD));
		LoginParamsDto loginParams = new LoginParamsDto();
		loginParams.setUserName(user.getUserName());
		loginParams.setPassword(PASSWORD);
		return userController.login(loginParams);
	}

	private Users createUser() {
		Users user = new Users("userName", "password", "firstName", "lastName", "a@a", "avatar.png");
		user.setRole(RoleType.USER);
		return user;
	}

	private Post createPost(Users u, Category c) throws IncorrectPriceException, InstanceNotFoundException {
		return postService.createPost(u.getId(), "Title3", "description", "url", 16.67, new ArrayList<>(), c.getId(),
				Post.Type.COUPON, "A123", LocalDateTime.now().plusDays(1));
	}

}
