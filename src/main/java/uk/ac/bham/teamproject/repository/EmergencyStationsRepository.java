package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.EmergencyStations;

/**
 * Spring Data JPA repository for the EmergencyStations entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyStationsRepository extends JpaRepository<EmergencyStations, Long> {}
