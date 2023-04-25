package uk.ac.bham.teamproject.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.LostFound;

/**
 * Spring Data JPA repository for the LostFound entity.
 *
 * When extending this class, extend LostFoundRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface LostFoundRepository extends LostFoundRepositoryWithBagRelationships, JpaRepository<LostFound, Long> {
    default Optional<LostFound> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<LostFound> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<LostFound> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query(
        "select lostFound from LostFound lostFound  where ((:item) is null  or lostFound.item like concat('%',:item,'%')) " +
        "and ((cast(:lostStartDate as date) is null) or cast(lostFound.date as date) between cast(:lostStartDate as date) and cast(:lostenddate as date) ) and ((:location) is null  or lostFound.location like concat('%',:location,'%') )"
    )
    List<LostFound> getByFilters(
        @Param("item") String item,
        @Param("lostStartDate") Date lostStartDate,
        @Param("lostenddate") Date lostenddate,
        @Param("location") String location
    );
}
