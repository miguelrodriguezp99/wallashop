package es.udc.fi.dc.fd.rest.dtos;

public class FollowDto {

    private Long id;
    private UserDto user;
    private PostDto post;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDto getUser() {
        return user;
    }

    public FollowDto() {
        super();
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

}