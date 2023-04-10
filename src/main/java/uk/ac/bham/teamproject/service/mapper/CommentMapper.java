package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.Comment;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.service.dto.CommentDTO;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring")
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "crime", source = "crime", qualifiedByName = "crimeAlertId")
    CommentDTO toDto(Comment s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("crimeAlertId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CrimeAlertDTO toDtoCrimeAlertId(CrimeAlert crimeAlert);
}
