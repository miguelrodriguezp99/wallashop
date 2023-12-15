package es.udc.fi.dc.fd.model.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Category;
import es.udc.fi.dc.fd.model.entities.CategoryDao;
import es.udc.fi.dc.fd.model.entities.Comment;
import es.udc.fi.dc.fd.model.entities.CommentDao;
import es.udc.fi.dc.fd.model.entities.Follow;
import es.udc.fi.dc.fd.model.entities.FollowDao;
import es.udc.fi.dc.fd.model.entities.Notification;
import es.udc.fi.dc.fd.model.entities.NotificationDao;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.PostDao;
import es.udc.fi.dc.fd.model.entities.Rate;
import es.udc.fi.dc.fd.model.entities.RateDao;
import es.udc.fi.dc.fd.model.entities.UserDao;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPriceException;
import es.udc.fi.dc.fd.rest.dtos.RatesCountDto;

@Service
public class PostServiceImpl implements PostService {

	private final UserDao usersDao;
	private final PostDao postDao;
	private final CategoryDao categoryDao;
	private final RateDao rateDao;
	private final CommentDao commentDao;
	private final NotificationDao notificationDao;
	private final FollowDao followDao;

	@Autowired
	public PostServiceImpl(UserDao usersDao, PostDao postDao, CategoryDao categoryDao, RateDao rateDao,
			CommentDao commentDao, NotificationDao notificationDao, FollowDao followDao) {
		this.usersDao = usersDao;
		this.postDao = postDao;
		this.categoryDao = categoryDao;
		this.rateDao = rateDao;
		this.commentDao = commentDao;
		this.notificationDao = notificationDao;
		this.followDao = followDao;
		
	}

	public Post createPost(Long userId, String title, String description, String url, Double price, List<String> images,
			Long categoryId, Post.Type type, String couponCodeString, LocalDateTime expirationDate)
			throws InstanceNotFoundException, IncorrectPriceException {
		Users users = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		LocalDateTime creationDate = LocalDateTime.now();

		Category category = categoryDao.findById(categoryId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.category", categoryId));

		if (price < 0.0) {
			throw new IncorrectPriceException();
		}
		Post post = new Post(title, description, url, price, images, creationDate, expirationDate, category, users,
				type, true);
		if (type == Post.Type.COUPON && couponCodeString != null && !couponCodeString.isEmpty()) {
			post.setCouponCode(couponCodeString);
		}

		return postDao.save(post);
	}

	public Page<Post> getLatestPosts(int page, int size) {
		PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
		return postDao.findAll(pageRequest);
	}

	public List<Category> getCategories() {
		return categoryDao.findAll();
	}

	public void deletePost(Long postId, Long userId) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		if (!post.getUser().getId().equals(userId)) {
			throw new InstanceNotFoundException("project.entities.user", userId);
		}

		List<Notification> notifications = notificationDao.findAllByPost(post);
		for (Notification notification : notifications) {
			notificationDao.delete(notification);
		}

		List<Comment> comments = commentDao.findAllByPost(post);
		for (Comment comment : comments) {
			commentDao.delete(comment);
		}

		List<Rate> rates = rateDao.findAllByPost(post);
		for (Rate rate : rates) {
			rateDao.delete(rate);
		}

		postDao.delete(post);
	}

	public void updatePost(Long userId, Long postId, String postTitle, String postDescription, String postUrl,
			Double postPrice, List<String> postImages, boolean isActive)
			throws InstanceNotFoundException, IncorrectPriceException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		if (!post.getUser().getId().equals(userId)) {
			throw new InstanceNotFoundException("project.entities.user", userId);
		}

		if (postPrice < 0.0) {
			throw new IncorrectPriceException();
		}
		
		if ((post.isActive()!= isActive) || (post.getTitle()!= postTitle) || (post.getDescription()!= postDescription)
				|| (post.getUrl()!= postUrl) || (post.getPrice()!= postPrice) || (post.getImages()!= postImages)) {
			List<Follow> follows = followDao.findAllByPost(post);
			Integer lenght = follows.size();
			for (Integer i = 0; i<lenght; i++) {
				createNotificationFollow(follows.get(i).getUser().getId(), follows.get(i).getPost().getId());
			}
		}
		post.setTitle(postTitle);
		post.setDescription(postDescription);
		post.setUrl(postUrl);
		post.setPrice(postPrice);
		post.setImages(postImages);
		post.setActive(isActive);
		postDao.save(post);
	}

	public void stillValid(Long postId)  throws InstanceNotFoundException {
        Optional<Post> opt = postDao.findById(postId);
        if (opt.isEmpty()) {
            throw new InstanceNotFoundException("project.entities.post", postId);
        }
        Post post = opt.get();
        post.setStillValid(LocalDateTime.now());
		postDao.save(post);
    }


	// ----- RATES
	// ------------------------------------------------------------------------------------

	public void ratePost(Long userId, Long postId, boolean rate) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		rateDao.findByUserAndPost(user, post).ifPresentOrElse(r -> {
			r.setRate(rate);
			rateDao.save(r);
		}, () -> {
			Rate newRate = new Rate(user, post, rate);
			rateDao.save(newRate);
		});
	}

	public List<Rate> getPostRates(Long postId) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));

		return rateDao.findAllByPost(post);
	}

	public RatesCountDto getPostNRates(Long postId) throws InstanceNotFoundException {
		return rateDao.countTrueAndFalseRatesByPostId(postId);
	}

	public Rate getUserRate(Long userId, Long postId) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		return rateDao.findByUserAndPost(user, post)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.rate", userId));
	}

	// ----- COMMENTS
	// ------------------------------------------------------------------------------------

	public List<Comment> getComments() {
		return commentDao.findAll();
	}

	public List<Comment> getPostComments(Long postId) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));

		return commentDao.findAllByParentCommentIdIsNullAndPost(post);
	}

	public Comment createComment(Long userId, Long postId, String text) throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));

		// Un comentario sin padre es un comentario raíz
		Comment comment = new Comment(user, post, text);

		Comment commentSave = commentDao.save(comment);

		if (!(post.getUser().getId().equals(userId))) {
			createNotificationPost(post.getUser().getId(), postId, commentSave.getId());
		}
		// Devolvemos el comentario creado (después lo convertiremos a CommentDto)
		return commentSave;
	}

	public void deleteComment(Long userId, Long commentId) throws InstanceNotFoundException {
		Comment comment = commentDao.findById(commentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", commentId));
		if (!comment.getUser().getId().equals(userId)) {
			throw new InstanceNotFoundException("project.entities.user", userId);
		}
		List<Notification> notifications = notificationDao.findAllByComment(comment);
		for (Notification notification : notifications) {
			notificationDao.delete(notification);
		}
		commentDao.delete(comment);
	}

	public Comment replyComment(Long userId, Long postId, Long parentCommentId, String text)
			throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		Comment parentComment = commentDao.findById(parentCommentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", parentCommentId));

		// RESPUESTA (HIJO)
		Comment comment = new Comment(user, post, parentComment, text);

		// Actualizamos comentarios hijos del padre y actualizamos el padre
		// List<Comment> childComments = parentComment.getChildComments();
		// childComments.add(comment);
		// parentComment.setChildComments(childComments);

		commentDao.save(parentComment);

		Comment commentSave = commentDao.save(comment);
		if (!(parentComment.getUser().getId().equals(userId))) {
			createNotificationReply(parentComment.getUser().getId(), postId, commentSave.getId(), parentCommentId);
		}
		return commentSave;
	}

	public void updateComment(Long userId, Long commentId, String text) throws InstanceNotFoundException {
		Comment comment = commentDao.findById(commentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", commentId));
		if (!comment.getUser().getId().equals(userId)) {
			throw new InstanceNotFoundException("project.entities.user", userId);
		}
		comment.setText(text);
		commentDao.save(comment);
	}

	public Comment getComment(Long commentId) throws InstanceNotFoundException {
		Comment comment = commentDao.findById(commentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", commentId));

		return comment;
	}

	// ------ Notification

	private void createNotificationPost(Long userId, Long postId, Long commentId) throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		Comment comment = commentDao.findById(commentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", commentId));

		Notification notification = new Notification(user, post, comment);

		notificationDao.save(notification);
	}

	private void createNotificationReply(Long userId, Long postId, Long commentId, Long parentCommentId)
			throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		Comment comment = commentDao.findById(commentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", commentId));
		Comment parentComment = commentDao.findById(parentCommentId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.comment", parentCommentId));

		Notification notification = new Notification(user, post, comment, parentComment);

		notificationDao.save(notification);
	}
	
	private void createNotificationFollow(Long userId, Long postId)
			throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));

		Notification notification = new Notification(user, post);

		notificationDao.save(notification);
	}
	
	// ------------- Follow
	
	public Follow createFollow(Long userId, Long postId) throws InstanceNotFoundException {
		Users user = usersDao.findById(userId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));
		
		if ((post.getUser().getId().equals(userId))) {
			throw new InstanceNotFoundException("project.entities.user", userId);
		}

		Follow follow = new Follow(user, post, false);

		return followDao.save(follow);
	}

	public List<Follow> getPostFollows(Long postId) throws InstanceNotFoundException {
		Post post = postDao.findById(postId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.post", postId));

		return followDao.findAllByPost(post);
	} 

	public void deleteFollow(Long followId) throws InstanceNotFoundException {
		Follow follow = followDao.findById(followId)
				.orElseThrow(() -> new InstanceNotFoundException("project.entities.follow", followId));
		
		followDao.delete(follow);
	}

}
