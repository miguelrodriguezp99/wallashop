package es.udc.fi.dc.fd.model.entities;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import es.udc.fi.dc.fd.rest.dtos.RatesCountDto;

public interface RateDao extends JpaRepository<Rate, Long> {
    List<Rate> findAllByUser(Users user);

    List<Rate> findAllByPost(Post post);

    Optional<Rate> findByUserAndPost(Users user, Post post);

    @Query("SELECT COUNT(r) FROM Rate r WHERE r.rate = true AND r.post.id = :postId")
    int countTrueRatesByPostId(@Param("postId") Long postId);

    @Query("SELECT COUNT(r) FROM Rate r WHERE r.rate = false AND r.post.id = :postId")
    int countFalseRatesByPostId(@Param("postId") Long postId);

    @Query("SELECT new es.udc.fi.dc.fd.rest.dtos.RatesCountDto("
            + "COUNT(r) FILTER (WHERE r.rate = true), "
            + "COUNT(r) FILTER (WHERE r.rate = false AND r.post.id = :postId))"
            + " FROM Rate r WHERE r.post.id = :postId")
    RatesCountDto countTrueAndFalseRatesByPostId(@Param("postId") Long postId);

    // Puedo devolver un array, pero me parece mas correcto devolver un objeto DTO
    // creado por mi.
    /*
     * @Query("SELECT COUNT(r) FILTER (WHERE r.rate = true) as trueCount, " +
     * "COUNT(r) FILTER (WHERE r.rate = false AND r.post.id = :postId) as falseCount "
     * +
     * "FROM Rate r WHERE r.post.id = :postId")
     * List<Object[]> countTrueAndFalseRatesByPostId(@Param("postId") Long postId);
     */

}