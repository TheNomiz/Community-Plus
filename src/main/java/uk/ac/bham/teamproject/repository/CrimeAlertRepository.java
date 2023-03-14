package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.CrimeAlert;

/**
 * Spring Data JPA repository for the CrimeAlert entity.
 */
@Repository
public interface CrimeAlertRepository extends JpaRepository<CrimeAlert, Long>, JpaSpecificationExecutor<CrimeAlert> {
    @Query("select crimeAlert from CrimeAlert crimeAlert where crimeAlert.postedby.login = ?#{principal.username}")
    List<CrimeAlert> findByPostedbyIsCurrentUser();

    default Optional<CrimeAlert> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CrimeAlert> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CrimeAlert> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby",
        countQuery = "select count(distinct crimeAlert) from CrimeAlert crimeAlert"
    )
    Page<CrimeAlert> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby")
    List<CrimeAlert> findAllWithToOneRelationships();

    @Query("select crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby where crimeAlert.id =:id")
    Optional<CrimeAlert> findOneWithToOneRelationships(@Param("id") Long id);
}
