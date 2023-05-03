package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.service.dto.EmergencyStationsDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.EmergencyStationsDb}.
 */
public interface EmergencyStationsService {
    /**
     * Save a emergencyStation.
     *
     * @param emergencyStationsDTO the entity to save.
     * @return the persisted entity.
     */
    EmergencyStationsDTO save(EmergencyStationsDTO emergencyStationsDTO);

    /**
     * Updates a crimeAlert.
     *
     * @param emergencyStationsDTO the entity to update.
     * @return the persisted entity.
     */
    EmergencyStationsDTO update(EmergencyStationsDTO emergencyStationsDTO);

    /**
     * Partially updates a crimeAlert.
     *
     * @param emergencyStationsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EmergencyStationsDTO> partialUpdate(EmergencyStationsDTO emergencyStationsDTO);

    /**
     * Get all the crimeAlerts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmergencyStationsDTO> findAll(Pageable pageable);

    /**
     * Get all the crimeAlerts with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmergencyStationsDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" crimeAlert.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmergencyStationsDTO> findOne(Long id);

    /**
     * Delete the "id" crimeAlert.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
