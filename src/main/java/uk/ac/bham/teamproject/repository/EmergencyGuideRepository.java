package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.EmergencyGuide;

/**
 * Spring Data JPA repository for the EmergencyGuide entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyGuideRepository extends JpaRepository<EmergencyGuide, Long> {}
