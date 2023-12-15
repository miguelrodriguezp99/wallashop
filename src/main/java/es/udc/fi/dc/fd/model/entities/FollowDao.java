package es.udc.fi.dc.fd.model.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowDao extends JpaRepository<Follow, Long> {

    List<Follow> findAllByOrderByIdDesc();
    
    // Buscar los follow por el id del post
    List<Follow> findAllByPost(Post post);
    
    // Buscar los follow por el id del user
    List<Follow> findAllByUser(Users user);
}
