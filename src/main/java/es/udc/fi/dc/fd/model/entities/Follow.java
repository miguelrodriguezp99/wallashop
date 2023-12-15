package es.udc.fi.dc.fd.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Table;

@Entity
@Table(name = "follow")
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId", nullable = false)
    private Post post;
    
    
    @Column(nullable = false)
    private Boolean expired;

    public Follow() {
    }

    public Follow(Users user, Post post, boolean expired) {
        this.user = user;
        this.post = post;
        this.expired = expired;
    }

    public Long getId() {
        return id;
    }

    public Users getUser() {
        return user;
    }

    public Post getPost() {
        return post;
    }
    
    public Boolean getExpired() {
        return expired;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public void setPost(Post post) {
        this.post = post;
    }
    
    public void setExpired(Boolean expired) {
        this.expired = expired;
    }

}
