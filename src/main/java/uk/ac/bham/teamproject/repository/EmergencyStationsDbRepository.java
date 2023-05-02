package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.EmergencyStations;
import uk.ac.bham.teamproject.domain.EmergencyStationsDb;

/**
 * Spring Data JPA repository for the EmergencyStations entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyStationsDbRepository extends JpaRepository<EmergencyStationsDb, Long> {
    default Optional<EmergencyStationsDb> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<EmergencyStationsDb> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<EmergencyStationsDb> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby",
        countQuery = "select count(distinct crimeAlert) from CrimeAlert crimeAlert"
    )
    Page<EmergencyStationsDb> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby")
    List<EmergencyStationsDb> findAllWithToOneRelationships();

    @Query("select crimeAlert from CrimeAlert crimeAlert left join fetch crimeAlert.postedby where crimeAlert.id =:id")
    Optional<EmergencyStationsDb> findOneWithToOneRelationships(@Param("id") Long id);
}
