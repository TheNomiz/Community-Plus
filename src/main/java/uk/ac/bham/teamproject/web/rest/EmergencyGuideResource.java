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
import uk.ac.bham.teamproject.domain.EmergencyGuide;
import uk.ac.bham.teamproject.repository.EmergencyGuideRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.EmergencyGuide}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmergencyGuideResource {

    private final Logger log = LoggerFactory.getLogger(EmergencyGuideResource.class);

    private static final String ENTITY_NAME = "emergencyGuide";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmergencyGuideRepository emergencyGuideRepository;

    public EmergencyGuideResource(EmergencyGuideRepository emergencyGuideRepository) {
        this.emergencyGuideRepository = emergencyGuideRepository;
    }

    /**
     * {@code POST  /emergency-guides} : Create a new emergencyGuide.
     *
     * @param emergencyGuide the emergencyGuide to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emergencyGuide, or with status {@code 400 (Bad Request)} if the emergencyGuide has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emergency-guides")
    public ResponseEntity<EmergencyGuide> createEmergencyGuide(@Valid @RequestBody EmergencyGuide emergencyGuide)
        throws URISyntaxException {
        log.debug("REST request to save EmergencyGuide : {}", emergencyGuide);
        if (emergencyGuide.getId() != null) {
            throw new BadRequestAlertException("A new emergencyGuide cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmergencyGuide result = emergencyGuideRepository.save(emergencyGuide);
        return ResponseEntity
            .created(new URI("/api/emergency-guides/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emergency-guides/:id} : Updates an existing emergencyGuide.
     *
     * @param id the id of the emergencyGuide to save.
     * @param emergencyGuide the emergencyGuide to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyGuide,
     * or with status {@code 400 (Bad Request)} if the emergencyGuide is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emergencyGuide couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emergency-guides/{id}")
    public ResponseEntity<EmergencyGuide> updateEmergencyGuide(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EmergencyGuide emergencyGuide
    ) throws URISyntaxException {
        log.debug("REST request to update EmergencyGuide : {}, {}", id, emergencyGuide);
        if (emergencyGuide.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyGuide.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyGuideRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmergencyGuide result = emergencyGuideRepository.save(emergencyGuide);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyGuide.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emergency-guides/:id} : Partial updates given fields of an existing emergencyGuide, field will ignore if it is null
     *
     * @param id the id of the emergencyGuide to save.
     * @param emergencyGuide the emergencyGuide to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyGuide,
     * or with status {@code 400 (Bad Request)} if the emergencyGuide is not valid,
     * or with status {@code 404 (Not Found)} if the emergencyGuide is not found,
     * or with status {@code 500 (Internal Server Error)} if the emergencyGuide couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emergency-guides/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmergencyGuide> partialUpdateEmergencyGuide(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EmergencyGuide emergencyGuide
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmergencyGuide partially : {}, {}", id, emergencyGuide);
        if (emergencyGuide.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyGuide.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyGuideRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmergencyGuide> result = emergencyGuideRepository
            .findById(emergencyGuide.getId())
            .map(existingEmergencyGuide -> {
                if (emergencyGuide.getEmergencyType() != null) {
                    existingEmergencyGuide.setEmergencyType(emergencyGuide.getEmergencyType());
                }
                if (emergencyGuide.getPanicButton() != null) {
                    existingEmergencyGuide.setPanicButton(emergencyGuide.getPanicButton());
                }

                return existingEmergencyGuide;
            })
            .map(emergencyGuideRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyGuide.getId().toString())
        );
    }

    /**
     * {@code GET  /emergency-guides} : get all the emergencyGuides.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emergencyGuides in body.
     */
    @GetMapping("/emergency-guides")
    public ResponseEntity<List<EmergencyGuide>> getAllEmergencyGuides(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of EmergencyGuides");
        Page<EmergencyGuide> page = emergencyGuideRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /emergency-guides/:id} : get the "id" emergencyGuide.
     *
     * @param id the id of the emergencyGuide to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emergencyGuide, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emergency-guides/{id}")
    public ResponseEntity<EmergencyGuide> getEmergencyGuide(@PathVariable Long id) {
        log.debug("REST request to get EmergencyGuide : {}", id);
        Optional<EmergencyGuide> emergencyGuide = emergencyGuideRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emergencyGuide);
    }

    /**
     * {@code DELETE  /emergency-guides/:id} : delete the "id" emergencyGuide.
     *
     * @param id the id of the emergencyGuide to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emergency-guides/{id}")
    public ResponseEntity<Void> deleteEmergencyGuide(@PathVariable Long id) {
        log.debug("REST request to delete EmergencyGuide : {}", id);
        emergencyGuideRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
