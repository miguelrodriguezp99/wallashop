package es.udc.fi.dc.fd.rest.dtos;

import java.util.List;

public class CommentDto {

    private Long id;
    private UserDto user;
    private PostDto post;
    private List<CommentDto> childComments;
    private Long parentCommentId;
    private String text;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDto getUser() {
        return user;
    }

    public CommentDto() {
        super();
    }

    public CommentDto(UserDto user, PostDto post){
        this.user = user;
        this.post = post;
    }

    public CommentDto(UserDto user, PostDto post, Long parentCommentId){
        this.user = user;
        this.post = post;
        this.parentCommentId = parentCommentId;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public PostDto getPost() {
        return post;
    }

    public void setPost(PostDto post) {
        this.post = post;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<CommentDto> getChildComments() {
        return childComments;
    }

    public void setChildComments(List<CommentDto> childComments) {
        this.childComments = childComments;
    }
}