package es.udc.fi.dc.fd.rest.dtos;

import java.util.List;
import java.util.stream.Collectors;

import es.udc.fi.dc.fd.model.entities.Follow;

public class FollowConverter {

    // DtoConverter
    public static FollowDto toDto(Follow follow) {
    	FollowDto dto = new FollowDto();
        dto.setId(follow.getId());
        dto.setUser(UserConversor.toUserDto(follow.getUser()));
        dto.setPost(PostConverter.toDto(follow.getPost()));
        
        return dto;
    }

    // ListConverter
    public static List<FollowDto> toDtoList(List<Follow> followList) {
        return followList.stream().map(FollowConverter::toDto).collect(Collectors.toList());
    }

}
