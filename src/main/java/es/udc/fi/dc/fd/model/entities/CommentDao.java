package es.udc.fi.dc.fd.model.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentDao extends JpaRepository<Comment, Long> {

    List<Comment> findAllByOrderByIdDesc();

    // Buscar los comentarios por el id del post
    List<Comment> findAllByPost(Post post);

    // Buscar comentarios con el parentCommentId a nulo (es decir, buscar solo
    // comentarios padre)
    List<Comment> findAllByParentCommentIdIsNullAndPost(Post post);
}
