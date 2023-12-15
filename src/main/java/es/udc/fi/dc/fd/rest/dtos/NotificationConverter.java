package es.udc.fi.dc.fd.rest.dtos;

import java.util.List;
import java.util.stream.Collectors;
import es.udc.fi.dc.fd.model.entities.Notification;

public class NotificationConverter {

    // DtoConverter
    public static NotificationDto toDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUser(UserConversor.toUserDto(notification.getUser()));
        dto.setPost(PostConverter.toDto(notification.getPost()));

        if (notification.getComment() != null)
            dto.setComment(CommentConverter.toDto(notification.getComment()));
        else
            dto.setComment(null);
        
        if (notification.getParentComment() != null)
            dto.setParentComment(CommentConverter.toDto(notification.getParentComment()));
        else
            dto.setParentComment(null);

        return dto;
    }

    // ListConverter
    public static List<NotificationDto> toDtoList(List<Notification> notificationList) {
        return notificationList.stream().map(NotificationConverter::toDto).collect(Collectors.toList());
    }

}
