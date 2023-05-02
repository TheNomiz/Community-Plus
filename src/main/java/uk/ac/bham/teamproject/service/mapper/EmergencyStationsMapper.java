package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.ac.bham.teamproject.domain.EmergencyStationsDb;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.service.dto.EmergencyStationsDTO;
import uk.ac.bham.teamproject.service.dto.UserDTO;

/**
 * Mapper for the entity {@link uk.ac.bham.teamproject.domain.EmergencyStationsDb} and its DTO {@link uk.ac.bham.teamproject.service.dto.EmergencyStationsDTO}.
 */
@Mapper(componentModel = "spring")
public interface EmergencyStationsMapper extends EntityMapper<EmergencyStationsDTO, EmergencyStationsDb> {
    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
