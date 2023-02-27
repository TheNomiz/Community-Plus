package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.dto.UserDTO;

/**
 * Mapper for the entity {@link CrimeAlert} and its DTO {@link CrimeAlertDTO}.
 */
@Mapper(componentModel = "spring")
public interface CrimeAlertMapper extends EntityMapper<CrimeAlertDTO, CrimeAlert> {
    @Mapping(target = "postedby", source = "postedby", qualifiedByName = "userLogin")
    CrimeAlertDTO toDto(CrimeAlert s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
