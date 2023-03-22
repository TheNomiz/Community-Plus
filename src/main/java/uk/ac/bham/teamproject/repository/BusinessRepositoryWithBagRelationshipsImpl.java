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
import uk.ac.bham.teamproject.domain.Business;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class BusinessRepositoryWithBagRelationshipsImpl implements BusinessRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Business> fetchBagRelationships(Optional<Business> business) {
        return business.map(this::fetchBusinessrooms);
    }

    @Override
    public Page<Business> fetchBagRelationships(Page<Business> businesses) {
        return new PageImpl<>(fetchBagRelationships(businesses.getContent()), businesses.getPageable(), businesses.getTotalElements());
    }

    @Override
    public List<Business> fetchBagRelationships(List<Business> businesses) {
        return Optional.of(businesses).map(this::fetchBusinessrooms).orElse(Collections.emptyList());
    }

    Business fetchBusinessrooms(Business result) {
        return entityManager
            .createQuery(
                "select business from Business business left join fetch business.businessrooms where business is :business",
                Business.class
            )
            .setParameter("business", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Business> fetchBusinessrooms(List<Business> businesses) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, businesses.size()).forEach(index -> order.put(businesses.get(index).getId(), index));
        List<Business> result = entityManager
            .createQuery(
                "select distinct business from Business business left join fetch business.businessrooms where business in :businesses",
                Business.class
            )
            .setParameter("businesses", businesses)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
