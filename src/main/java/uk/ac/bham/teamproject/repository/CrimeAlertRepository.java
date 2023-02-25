package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.CrimeAlert;

/**
 * Spring Data JPA repository for the CrimeAlert entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CrimeAlertRepository extends JpaRepository<CrimeAlert, Long>, JpaSpecificationExecutor<CrimeAlert> {}
