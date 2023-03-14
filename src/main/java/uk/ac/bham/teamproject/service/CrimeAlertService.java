package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.CrimeAlert}.
 */
public interface CrimeAlertService {
    /**
     * Save a crimeAlert.
     *
     * @param crimeAlertDTO the entity to save.
     * @return the persisted entity.
     */
    CrimeAlertDTO save(CrimeAlertDTO crimeAlertDTO);

    /**
     * Updates a crimeAlert.
     *
     * @param crimeAlertDTO the entity to update.
     * @return the persisted entity.
     */
    CrimeAlertDTO update(CrimeAlertDTO crimeAlertDTO);

    /**
     * Partially updates a crimeAlert.
     *
     * @param crimeAlertDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CrimeAlertDTO> partialUpdate(CrimeAlertDTO crimeAlertDTO);

    /**
     * Get all the crimeAlerts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CrimeAlertDTO> findAll(Pageable pageable);

    /**
     * Get all the crimeAlerts with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CrimeAlertDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" crimeAlert.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CrimeAlertDTO> findOne(Long id);

    /**
     * Delete the "id" crimeAlert.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
