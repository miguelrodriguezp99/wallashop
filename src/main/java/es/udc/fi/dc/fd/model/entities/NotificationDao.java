package es.udc.fi.dc.fd.model.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationDao extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByIdDesc();
    
    // Buscar los comentarios por el id del post
    List<Notification> findAllByPost(Post post);
    
    // Buscar los comentarios por el id del user
    List<Notification> findAllByUser(Users user);

    // Buscar los comentarios por el id del comment
    List<Notification> findAllByComment(Comment comment);
}
