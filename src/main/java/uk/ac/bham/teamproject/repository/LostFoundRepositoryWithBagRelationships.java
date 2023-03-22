package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.LostFound;

public interface LostFoundRepositoryWithBagRelationships {
    Optional<LostFound> fetchBagRelationships(Optional<LostFound> lostFound);

    List<LostFound> fetchBagRelationships(List<LostFound> lostFounds);

    Page<LostFound> fetchBagRelationships(Page<LostFound> lostFounds);
}
