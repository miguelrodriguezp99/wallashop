package es.udc.fi.dc.fd.model.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;

import es.udc.fi.dc.fd.model.common.exceptions.InstanceNotFoundException;
import es.udc.fi.dc.fd.model.entities.Category;
import es.udc.fi.dc.fd.model.entities.Comment;
import es.udc.fi.dc.fd.model.entities.Follow;
import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.Rate;
import es.udc.fi.dc.fd.model.services.exceptions.IncorrectPriceException;
import es.udc.fi.dc.fd.rest.dtos.RatesCountDto;

public interface PostService {

        Post createPost(Long userId, String title, String description, String url, Double price, List<String> images,
                        Long category, Post.Type type, String couponCode, LocalDateTime expirationDate)
                        throws InstanceNotFoundException, IncorrectPriceException;

        Page<Post> getLatestPosts(int page, int size);

        void deletePost(Long postId, Long userId) throws InstanceNotFoundException;

        void updatePost(Long postId, Long userId, String title, String description, String url, Double price,
                        List<String> images, boolean isActive)
                        throws InstanceNotFoundException, IncorrectPriceException;

        void ratePost(Long postId, Long userId, boolean rate) throws InstanceNotFoundException;

        RatesCountDto getPostNRates(Long postId) throws InstanceNotFoundException;

        Rate getUserRate(Long userId, Long postId) throws InstanceNotFoundException;

        List<Category> getCategories();

        void stillValid(Long postId) throws InstanceNotFoundException;

        List<Rate> getPostRates(Long postId) throws InstanceNotFoundException;

        List<Comment> getComments();

        List<Comment> getPostComments(Long postId) throws InstanceNotFoundException;

        Comment createComment(Long userId, Long postId, String text) throws InstanceNotFoundException;

        Comment replyComment(Long userId, Long postId, Long parentCommentId, String text)
                        throws InstanceNotFoundException;

        void updateComment(Long userId, Long commentId, String text) throws InstanceNotFoundException;

        void deleteComment(Long userId, Long commentId) throws InstanceNotFoundException;

        Comment getComment(Long commentId) throws InstanceNotFoundException;
        
        Follow createFollow(Long userId, Long postId) throws InstanceNotFoundException;
        
        List<Follow> getPostFollows(Long postId) throws InstanceNotFoundException;
        
        void deleteFollow(Long followId) throws InstanceNotFoundException;

}
