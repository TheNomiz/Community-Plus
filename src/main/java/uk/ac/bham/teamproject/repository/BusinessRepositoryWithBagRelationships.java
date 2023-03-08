package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.Business;

public interface BusinessRepositoryWithBagRelationships {
    Optional<Business> fetchBagRelationships(Optional<Business> business);

    List<Business> fetchBagRelationships(List<Business> businesses);

    Page<Business> fetchBagRelationships(Page<Business> businesses);
}
