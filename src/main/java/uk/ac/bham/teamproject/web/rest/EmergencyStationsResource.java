package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.EmergencyStations;
import uk.ac.bham.teamproject.repository.EmergencyStationsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.EmergencyStations}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmergencyStationsResource {

    private final Logger log = LoggerFactory.getLogger(EmergencyStationsResource.class);

    private static final String ENTITY_NAME = "emergencyStations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmergencyStationsRepository emergencyStationsRepository;

    public EmergencyStationsResource(EmergencyStationsRepository emergencyStationsRepository) {
        this.emergencyStationsRepository = emergencyStationsRepository;
    }

    /**
     * {@code POST  /emergency-stations} : Create a new emergencyStations.
     *
     * @param emergencyStations the emergencyStations to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emergencyStations, or with status {@code 400 (Bad Request)} if the emergencyStations has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emergency-stations")
    public ResponseEntity<EmergencyStations> createEmergencyStations(@Valid @RequestBody EmergencyStations emergencyStations)
        throws URISyntaxException {
        log.debug("REST request to save EmergencyStations : {}", emergencyStations);
        if (emergencyStations.getId() != null) {
            throw new BadRequestAlertException("A new emergencyStations cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmergencyStations result = emergencyStationsRepository.save(emergencyStations);
        return ResponseEntity
            .created(new URI("/api/emergency-stations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emergency-stations/:id} : Updates an existing emergencyStations.
     *
     * @param id the id of the emergencyStations to save.
     * @param emergencyStations the emergencyStations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyStations,
     * or with status {@code 400 (Bad Request)} if the emergencyStations is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emergencyStations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emergency-stations/{id}")
    public ResponseEntity<EmergencyStations> updateEmergencyStations(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EmergencyStations emergencyStations
    ) throws URISyntaxException {
        log.debug("REST request to update EmergencyStations : {}, {}", id, emergencyStations);
        if (emergencyStations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyStations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyStationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmergencyStations result = emergencyStationsRepository.save(emergencyStations);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyStations.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emergency-stations/:id} : Partial updates given fields of an existing emergencyStations, field will ignore if it is null
     *
     * @param id the id of the emergencyStations to save.
     * @param emergencyStations the emergencyStations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyStations,
     * or with status {@code 400 (Bad Request)} if the emergencyStations is not valid,
     * or with status {@code 404 (Not Found)} if the emergencyStations is not found,
     * or with status {@code 500 (Internal Server Error)} if the emergencyStations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emergency-stations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmergencyStations> partialUpdateEmergencyStations(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EmergencyStations emergencyStations
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmergencyStations partially : {}, {}", id, emergencyStations);
        if (emergencyStations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyStations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyStationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmergencyStations> result = emergencyStationsRepository
            .findById(emergencyStations.getId())
            .map(existingEmergencyStations -> {
                if (emergencyStations.getName() != null) {
                    existingEmergencyStations.setName(emergencyStations.getName());
                }
                if (emergencyStations.getStationType() != null) {
                    existingEmergencyStations.setStationType(emergencyStations.getStationType());
                }
                if (emergencyStations.getWheelchairAccess() != null) {
                    existingEmergencyStations.setWheelchairAccess(emergencyStations.getWheelchairAccess());
                }
                if (emergencyStations.getParking() != null) {
                    existingEmergencyStations.setParking(emergencyStations.getParking());
                }
                if (emergencyStations.getLatitude() != null) {
                    existingEmergencyStations.setLatitude(emergencyStations.getLatitude());
                }
                if (emergencyStations.getLongitude() != null) {
                    existingEmergencyStations.setLongitude(emergencyStations.getLongitude());
                }

                return existingEmergencyStations;
            })
            .map(emergencyStationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyStations.getId().toString())
        );
    }

    /**
     * {@code GET  /emergency-stations} : get all the emergencyStations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emergencyStations in body.
     */
    @GetMapping("/emergency-stations")
    public ResponseEntity<List<EmergencyStations>> getAllEmergencyStations(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of EmergencyStations");
        Page<EmergencyStations> page = emergencyStationsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /emergency-stations/:id} : get the "id" emergencyStations.
     *
     * @param id the id of the emergencyStations to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emergencyStations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emergency-stations/{id}")
    public ResponseEntity<EmergencyStations> getEmergencyStations(@PathVariable Long id) {
        log.debug("REST request to get EmergencyStations : {}", id);
        Optional<EmergencyStations> emergencyStations = emergencyStationsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emergencyStations);
    }

    /**
     * {@code DELETE  /emergency-stations/:id} : delete the "id" emergencyStations.
     *
     * @param id the id of the emergencyStations to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emergency-stations/{id}")
    public ResponseEntity<Void> deleteEmergencyStations(@PathVariable Long id) {
        log.debug("REST request to delete EmergencyStations : {}", id);
        emergencyStationsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
