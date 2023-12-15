package es.udc.fi.dc.fd.model.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment")
public class Comment {

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
    @JoinColumn(name = "parentCommentId")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> childComments;

    private String text;

    public Comment() {
    }

    public Comment(Users user, Post post, Comment parentComment, String text) {
        this.user = user;
        this.post = post;
        this.parentComment = parentComment;
        this.text = text;
        this.childComments = null;
    }

    public Comment(Users user, Post post, String text) {
        this.user = user;
        this.post = post;
        this.text = text;
        this.childComments = null;
        this.parentComment = null;
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

    public Comment getParentComment() {
        return parentComment;
    }

    public String getText() {
        return text;
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

    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setChildComments(List<Comment> childComments) {
        this.childComments = childComments;
    }

    public List<Comment> getChildComments() {
        return childComments;
    }
}
