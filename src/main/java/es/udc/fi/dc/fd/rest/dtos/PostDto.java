package es.udc.fi.dc.fd.rest.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {
	private Long id;
	private String title;
	private String description;
	private String url;
	private Double price;
	private List<String> images;
	private LocalDateTime creationDate;
	private LocalDateTime expirationDate;
	private CategoryDto category;
	private UserDto user;
	private String type;
	private String couponCode;
	private boolean isActive;
	private LocalDateTime stillValid;

	public PostDto() {
	}

	public PostDto(String title, String description, String url, Double price, List<String> images,
			LocalDateTime creationDate, LocalDateTime expirationDate, CategoryDto category, UserDto user, String type,
			String couponCode,
			boolean isActive) {
		this.title = title;
		this.description = description;
		this.url = url;
		this.price = price;
		this.images = images;
		this.creationDate = creationDate;
		this.expirationDate = expirationDate;
		this.category = category;
		this.user = user;
		this.type = type;
		this.couponCode = couponCode;
		this.isActive = isActive;
	}

	@Override
	public String toString() {
		return "PostDto [id=" + id + ", title=" + title + ", description=" + description + ", url=" + url + ", price="
				+ price + ", images=" + images + ", creationDate=" + creationDate + ", category=" + category + ", user="
				+ user + ", type=" + type + ", couponCode=" + couponCode + ", isActive=" + isActive + "]";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public LocalDateTime getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(LocalDateTime expirationDate) {
		this.expirationDate = expirationDate;
	}

	public CategoryDto getCategory() {
		return category;
	}

	public void setCategory(CategoryDto category) {
		this.category = category;
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCouponCode() {
		return couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public LocalDateTime getStillValid() {
        return stillValid;
    }
	
    public void setStillValid(LocalDateTime stillValid) {
        this.stillValid = stillValid;
    }

}
