package es.udc.fi.dc.fd.rest.dtos;

import java.util.List;
import java.util.stream.Collectors;

import es.udc.fi.dc.fd.model.entities.Comment;

public class CommentConverter {

    // DtoConverter
    public static CommentDto toDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setUser(UserConversor.toUserDto(comment.getUser()));
        dto.setPost(PostConverter.toDto(comment.getPost()));

        if (comment.getParentComment() != null)
            dto.setParentCommentId(comment.getParentComment().getId());
        else
            dto.setParentCommentId(null);

        dto.setText(comment.getText());

        if (comment.getChildComments() != null)
            dto.setChildComments(toDtoList(comment.getChildComments()));
        else
            dto.setChildComments(null);

        return dto;
    }

    // ListConverter
    public static List<CommentDto> toDtoList(List<Comment> commentList) {
        return commentList.stream().map(CommentConverter::toDto).collect(Collectors.toList());
    }

    public static Comment toEntity(CommentDto dto){
        Comment comment = new Comment();
        comment.setId(dto.getId());
        comment.setUser(UserConversor.toUser(dto.getUser()));
        comment.setPost(PostConverter.toEntity(dto.getPost()));
        comment.setText(dto.getText());
        return comment;
    }

    // Nuevo método para convertir un Comment sin convertir sus childComments
    // private static CommentDto toDtoWithoutChildComments(Comment comment) {
    // CommentDto dto = new CommentDto();
    // dto.setId(comment.getId());
    // dto.setUser(UserConversor.toUserDto(comment.getUser()));
    // dto.setPost(PostConverter.toDto(comment.getPost()));

    // if (comment.getParentCommentId() != null)
    // dto.setParentComment(toDtoWithoutChildComments(comment.getParentCommentId()));
    // else
    // dto.setParentCommentId(null);

    // dto.setText(comment.getText());
    // dto.setChildComments(null); // Evitar llamada recursiva

    // return dto;
    // }

}
