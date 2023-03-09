package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.EmergencyStationsPage;

/**
 * Spring Data JPA repository for the EmergencyStationsPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyStationsPageRepository extends JpaRepository<EmergencyStationsPage, Long> {}
