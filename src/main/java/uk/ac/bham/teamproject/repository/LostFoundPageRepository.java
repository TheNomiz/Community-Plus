package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.LostFoundPage;

/**
 * Spring Data JPA repository for the LostFoundPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LostFoundPageRepository extends JpaRepository<LostFoundPage, Long> {}
