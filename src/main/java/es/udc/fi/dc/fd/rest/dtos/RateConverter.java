package es.udc.fi.dc.fd.rest.dtos;


import es.udc.fi.dc.fd.model.entities.Post;
import es.udc.fi.dc.fd.model.entities.Users;
import es.udc.fi.dc.fd.model.entities.Rate;

public class RateConverter {
    public static Rate toEntity(RateDto dto, Post post, Users user) {
        Rate rate = new Rate();
        rate.setPost(post);
        rate.setUser(user);
        rate.setRate(dto.getRate());
        return rate;
    }

    public static RateDto toDto(Rate rate) {
        RateDto dto = new RateDto();
        dto.setId(rate.getId());
        dto.setPost(PostConverter.toDto(rate.getPost()));
        dto.setUser(UserConversor.toUserDto(rate.getUser()));
        dto.setRate(rate.getRate());
        return dto;
    }
}