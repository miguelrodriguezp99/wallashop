package es.udc.fi.dc.fd.model.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Table;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commentId")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentCommentId")
    private Comment parentComment;

    public Notification() {
    }

    public Notification(Users user, Post post, Comment comment, Comment parentComment) {
        this.user = user;
        this.post = post;
        this.comment = comment;
        this.parentComment = parentComment;
    }

    public Notification(Users user, Post post, Comment comment) {
        this.user = user;
        this.post = post;
        this.comment = comment;
    }
    
    public Notification(Users user, Post post) {
        this.user = user;
        this.post = post;
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

    public Comment getComment() {
        return comment;
    }

    public Comment getParentComment() {
        return parentComment;
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

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }

}
