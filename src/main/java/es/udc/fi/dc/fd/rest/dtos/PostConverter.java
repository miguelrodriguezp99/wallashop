package es.udc.fi.dc.fd.rest.dtos;

import es.udc.fi.dc.fd.model.entities.Post;

public class PostConverter {
	public static Post toEntity(PostDto dto) {
		Post post = new Post();
		post.setTitle(dto.getTitle());
		post.setDescription(dto.getDescription());
		post.setUrl(dto.getUrl());
		post.setPrice(dto.getPrice());
		post.setImages(dto.getImages());
		post.setCreationDate(dto.getCreationDate());
		post.setExpirationDate(dto.getExpirationDate());
		post.setCategory(CategoryConverter.toEntity(dto.getCategory()));
		post.setUser(UserConversor.toUser(dto.getUser()));
		post.setType(Post.Type.valueOf(dto.getType()));
		post.setCouponCode(dto.getCouponCode());
		post.setActive(dto.isActive());
		post.setStillValid(dto.getStillValid());
		return post;
	}

	public static PostDto toDto(Post post) {
		PostDto dto = new PostDto();
		dto.setId(post.getId());
		dto.setTitle(post.getTitle());
		dto.setDescription(post.getDescription());
		dto.setUrl(post.getUrl());
		dto.setPrice(post.getPrice());
		dto.setImages(post.getImages());
		dto.setCreationDate(post.getCreationDate());
		dto.setExpirationDate(post.getExpirationDate());
		dto.setCategory(CategoryConverter.toDto(post.getCategory())); // Utiliza el Converter de Category
		dto.setUser(UserConversor.toUserDto(post.getUser()));
		dto.setType(post.getType().toString());
		dto.setCouponCode(post.getCouponCode());
		dto.setActive(post.isActive());
		dto.setStillValid(post.getStillValid());
		return dto;
	}
}
