package uk.ac.bham.teamproject.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import uk.ac.bham.teamproject.domain.LostFound;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class LostFoundRepositoryWithBagRelationshipsImpl implements LostFoundRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<LostFound> fetchBagRelationships(Optional<LostFound> lostFound) {
        return lostFound.map(this::fetchLostItems);
    }

    @Override
    public Page<LostFound> fetchBagRelationships(Page<LostFound> lostFounds) {
        return new PageImpl<>(fetchBagRelationships(lostFounds.getContent()), lostFounds.getPageable(), lostFounds.getTotalElements());
    }

    @Override
    public List<LostFound> fetchBagRelationships(List<LostFound> lostFounds) {
        return Optional.of(lostFounds).map(this::fetchLostItems).orElse(Collections.emptyList());
    }

    LostFound fetchLostItems(LostFound result) {
        return entityManager
            .createQuery(
                "select lostFound from LostFound lostFound left join fetch lostFound.lostItems where lostFound is :lostFound",
                LostFound.class
            )
            .setParameter("lostFound", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<LostFound> fetchLostItems(List<LostFound> lostFounds) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, lostFounds.size()).forEach(index -> order.put(lostFounds.get(index).getId(), index));
        List<LostFound> result = entityManager
            .createQuery(
                "select distinct lostFound from LostFound lostFound left join fetch lostFound.lostItems where lostFound in :lostFounds",
                LostFound.class
            )
            .setParameter("lostFounds", lostFounds)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
