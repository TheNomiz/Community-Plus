package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.domain.LostFound;

/**
 * Service Interface for managing {@link LostFound}.
 */
public interface LostFoundService {
    /**
     * Save a lostFound.
     *
     * @param lostFound the entity to save.
     * @return the persisted entity.
     */
    LostFound save(LostFound lostFound);

    /**
     * Updates a lostFound.
     *
     * @param lostFound the entity to update.
     * @return the persisted entity.
     */
    LostFound update(LostFound lostFound);

    /**
     * Get all the lostFounds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LostFound> findAll(Pageable pageable);

    /**
     * Get the "id" lostFound.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LostFound> findOne(Long id);

    /**
     * Delete the "id" lostFound.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
