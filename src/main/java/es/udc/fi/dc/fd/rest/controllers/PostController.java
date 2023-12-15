package es.udc.fi.dc.fd.rest.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Comment;
import es.udc.fi.dc.fd.model.entities.Follow;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.services.PostService;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPriceException;
import es.udc.fi.dc.fd.rest.dtos.CategoryConverter;
import es.udc.fi.dc.fd.rest.dtos.CategoryDto;
import es.udc.fi.dc.fd.rest.dtos.CommentConverter;
import es.udc.fi.dc.fd.rest.dtos.CommentDto;
import es.udc.fi.dc.fd.rest.dtos.FollowConverter;
import es.udc.fi.dc.fd.rest.dtos.FollowDto;
import es.udc.fi.dc.fd.rest.dtos.PostConverter;
import es.udc.fi.dc.fd.rest.dtos.PostDto;
import es.udc.fi.dc.fd.rest.dtos.RateConverter;
import es.udc.fi.dc.fd.rest.dtos.RateDto;
import es.udc.fi.dc.fd.rest.dtos.RatesCountDto;

@RestController
@RequestMapping("/api/posts")
public class PostController {

	private final PostService postService;

	@Autowired
	public PostController(PostService postService) {
		this.postService = postService;
	}

	@PostMapping("/")
	public ResponseEntity<PostDto> createPost(@RequestAttribute Long userId, @RequestBody PostDto post)
			throws InstanceNotFoundException, IncorrectPriceException {
		// Utiliza el servicio para crear el post
		LocalDateTime expirationDate = post.getExpirationDate();

		if (expirationDate == null) {
			expirationDate = LocalDateTime.now().plusDays(30);
		}

		Post createdPost = postService.createPost(userId, post.getTitle(), post.getDescription(), post.getUrl(),
				post.getPrice(), post.getImages(), post.getCategory().getId(), Post.Type.valueOf(post.getType()),
				post.getCouponCode(), expirationDate);

		// Convierte el post creado de nuevo a un DTO para la respuesta
		PostDto createdPostDto = PostConverter.toDto(createdPost);

		// Devuelve una respuesta HTTP 201 (Created) con el DTO del post creado
		return new ResponseEntity<>(createdPostDto, HttpStatus.CREATED);
	}

	@GetMapping("/")
	public ResponseEntity<Page<PostDto>> getLatestPosts(@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "9") int size) {
		Page<PostDto> posts = postService.getLatestPosts(page, size).map(PostConverter::toDto);
		return ResponseEntity.ok(posts);
	}

	@GetMapping("/categories")
	public ResponseEntity<List<CategoryDto>> getCategories() {
		return new ResponseEntity<>(CategoryConverter.toDtoList(postService.getCategories()), HttpStatus.OK);
	}

	@DeleteMapping("/{postId}")
	public ResponseEntity<Void> deletePost(@RequestAttribute Long userId, @PathVariable Long postId)
			throws InstanceNotFoundException {
		postService.deletePost(postId, userId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PutMapping("/{postId}")
	public ResponseEntity<Void> updatePost(@RequestAttribute Long userId, @PathVariable Long postId,
			@RequestBody PostDto post) throws InstanceNotFoundException, IncorrectPriceException {
		postService.updatePost(userId, postId, post.getTitle(), post.getDescription(), post.getUrl(), post.getPrice(),
				post.getImages(), post.isActive());
		System.out.println(post.isActive());
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/{postId}/like/{rate}")
	public ResponseEntity<Void> ratePost(@RequestAttribute Long userId, @PathVariable Long postId,
			@PathVariable String rate) throws InstanceNotFoundException {
		boolean rateBoolean = Boolean.parseBoolean(rate);
		postService.ratePost(userId, postId, rateBoolean);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/rates/{postId}")
	public ResponseEntity<List<RateDto>> getPostRates(@PathVariable Long postId) throws InstanceNotFoundException {
		List<RateDto> rates = postService.getPostRates(postId).stream().map(RateConverter::toDto)
				.collect(Collectors.toList());
		return new ResponseEntity<>(rates, HttpStatus.OK);
	}

	@GetMapping("/nrates/{postId}")
	public ResponseEntity<RatesCountDto> getPostNRates(@PathVariable Long postId) throws InstanceNotFoundException {
		RatesCountDto ratesCount = postService.getPostNRates(postId);
		return new ResponseEntity<>(ratesCount, HttpStatus.OK);
	}

	@GetMapping("/userrates/{postId}")
	public ResponseEntity<RateDto> getUserRate(@RequestAttribute Long userId, @PathVariable Long postId)
			throws InstanceNotFoundException {
		RateDto rate = RateConverter.toDto(postService.getUserRate(userId, postId));
		return new ResponseEntity<>(rate, HttpStatus.OK);
	}

	@PatchMapping("/{postId}/stillvalid")
    public HttpStatus updateStillValid(@PathVariable Long postId) throws InstanceNotFoundException {
        postService.stillValid(postId);
        return HttpStatus.OK;
    }


	// ----- COMMENTS
	// ------------------------------------------------------------------------------------

	@GetMapping("/comments")
	public ResponseEntity<List<CommentDto>> getComments() {
		return new ResponseEntity<>(CommentConverter.toDtoList(postService.getComments()), HttpStatus.OK);
	}

	@PostMapping("/{postId}/comment")
	public ResponseEntity<CommentDto> createComment(@RequestAttribute Long userId, @PathVariable Long postId,
			@RequestBody CommentDto comment) throws InstanceNotFoundException {
		Comment createdComment = postService.createComment(userId, postId, comment.getText());

		CommentDto createdCommentDto = CommentConverter.toDto(createdComment);

		return new ResponseEntity<>(createdCommentDto, HttpStatus.CREATED);
	}

	@DeleteMapping("/{postId}/comment/{commentId}")
	public ResponseEntity<Void> deleteComment(@RequestAttribute Long userId, @PathVariable Long commentId)
			throws InstanceNotFoundException {
		postService.deleteComment(userId, commentId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("{postId}/comment/{commentParentId}/reply")
	public ResponseEntity<CommentDto> replyComment(@RequestAttribute Long userId, @PathVariable Long postId,
			@PathVariable Long commentParentId, @RequestBody CommentDto comment) throws InstanceNotFoundException {
		Comment createdComment = postService.replyComment(userId, postId, commentParentId, comment.getText());

		CommentDto createdCommentDto = CommentConverter.toDto(createdComment);

		return new ResponseEntity<>(createdCommentDto, HttpStatus.CREATED);
	}

	// Cojo comentarios de un post en concreto
	@GetMapping("/{postId}/comments")
	public ResponseEntity<List<CommentDto>> getPostComments(@PathVariable Long postId)
			throws InstanceNotFoundException {
		List<CommentDto> comments = postService.getPostComments(postId).stream().map(CommentConverter::toDto)
				.collect(Collectors.toList());
		return new ResponseEntity<>(comments, HttpStatus.OK);
	}

	// INFORMACIÓN DE UN COMENTARIO EN CONCRETO
	@GetMapping("/comment/{commentId}")
	public ResponseEntity<CommentDto> getComment(@PathVariable Long commentId)
			throws InstanceNotFoundException {
		CommentDto comment = CommentConverter.toDto(postService.getComment(commentId));
		return new ResponseEntity<>(comment, HttpStatus.OK);
	}

	@PostMapping("/{postId}/follow")
	public ResponseEntity<FollowDto> createFollow(@RequestAttribute Long userId, @PathVariable Long postId) 
			throws InstanceNotFoundException {
		Follow createdFollow = postService.createFollow(userId, postId);

		FollowDto createdFollowDto = FollowConverter.toDto(createdFollow);

		return new ResponseEntity<>(createdFollowDto, HttpStatus.CREATED);
	}

	// Cojo los follows de un post en concreto
	@GetMapping("/{postId}/follows")
	public ResponseEntity<List<FollowDto>> getPostFollows(@PathVariable Long postId)
			throws InstanceNotFoundException {
		try {
			List<FollowDto> follows = postService.getPostFollows(postId)
					.stream()
					.map(FollowConverter::toDto)
					.collect(Collectors.toList());
	
			return new ResponseEntity<>(follows, HttpStatus.OK);
		} catch (InstanceNotFoundException e) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
		}
	}

    // Eliminar un follow
	@DeleteMapping("/{postId}/follow/{followId}")
	public ResponseEntity<Void> deleteFollow(@PathVariable Long followId)
			throws InstanceNotFoundException {
		postService.deleteFollow(followId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
}
