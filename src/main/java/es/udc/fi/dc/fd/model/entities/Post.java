package es.udc.fi.dc.fd.model.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

	public enum Type {
		OFFER, COUPON;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false)
	private String url;

	@Column(nullable = false)
	private Double price;

	@ElementCollection
	private List<String> images;

	@Column(nullable = false)
	private LocalDateTime creationDate;

	@Column(nullable = true)
    private LocalDateTime stillValid;


	@Column(nullable = true)
	private LocalDateTime expirationDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private Users user;

	@Column(nullable = false)
	private Type type;

	@Column(nullable = true)
	private String couponCode;

	@Column(nullable = false)
	private boolean isActive;

	public Post() {
	}

	public Post(String title, String description, String url, Double price, List<String> images,
			LocalDateTime creationDate, LocalDateTime expirationDate, Category category, Users user, Type type,
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
		this.isActive = isActive;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public LocalDateTime getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(LocalDateTime expirationDate) {
		if (expirationDate != null) {
			this.expirationDate = expirationDate;
		}
	}

	public String getDescription() {
		return description;
	}

	public String getUrl() {
		return url;
	}

	public Double getPrice() {
		return price;
	}

	public List<String> getImages() {
		return images;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}

	public Category getCategory() {
		return category;
	}

	public Users getUser() {
		return user;
	}

	public Type getType() {
		return type;
	}

	public String getCouponCode() {
		return couponCode;
	}

	public LocalDateTime getStillValid() {
		return stillValid;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public void setCreationDate(LocalDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean active) {
		isActive = active;
	}

	public void setStillValid(LocalDateTime stillValid) {
		this.stillValid = stillValid;
	}

	@Override
	public String toString() {
		return "Post{" +
				"id=" + id +
				", title='" + title + '\'' +
				", description='" + description + '\'' +
				", url='" + url + '\'' +
				", price=" + price +
				", images=" + images +
				", creationDate=" + creationDate +
				", category=" + category +
				", user=" + user +
				", type=" + type +
				", couponCode='" + couponCode + '\'' +
				", isActive=" + isActive +
				'}';
	}

}
