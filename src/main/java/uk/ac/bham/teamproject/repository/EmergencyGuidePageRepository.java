package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.EmergencyGuidePage;

/**
 * Spring Data JPA repository for the EmergencyGuidePage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyGuidePageRepository extends JpaRepository<EmergencyGuidePage, Long> {}
