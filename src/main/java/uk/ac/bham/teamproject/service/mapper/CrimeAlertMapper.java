package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;

/**
 * Mapper for the entity {@link CrimeAlert} and its DTO {@link CrimeAlertDTO}.
 */
@Mapper(componentModel = "spring")
public interface CrimeAlertMapper extends EntityMapper<CrimeAlertDTO, CrimeAlert> {}
