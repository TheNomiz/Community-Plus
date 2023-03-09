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
import uk.ac.bham.teamproject.domain.EmergencyStationsPage;
import uk.ac.bham.teamproject.repository.EmergencyStationsPageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.EmergencyStationsPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmergencyStationsPageResource {

    private final Logger log = LoggerFactory.getLogger(EmergencyStationsPageResource.class);

    private static final String ENTITY_NAME = "emergencyStationsPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmergencyStationsPageRepository emergencyStationsPageRepository;

    public EmergencyStationsPageResource(EmergencyStationsPageRepository emergencyStationsPageRepository) {
        this.emergencyStationsPageRepository = emergencyStationsPageRepository;
    }

    /**
     * {@code POST  /emergency-stations-pages} : Create a new emergencyStationsPage.
     *
     * @param emergencyStationsPage the emergencyStationsPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emergencyStationsPage, or with status {@code 400 (Bad Request)} if the emergencyStationsPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emergency-stations-pages")
    public ResponseEntity<EmergencyStationsPage> createEmergencyStationsPage(
        @Valid @RequestBody EmergencyStationsPage emergencyStationsPage
    ) throws URISyntaxException {
        log.debug("REST request to save EmergencyStationsPage : {}", emergencyStationsPage);
        if (emergencyStationsPage.getId() != null) {
            throw new BadRequestAlertException("A new emergencyStationsPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmergencyStationsPage result = emergencyStationsPageRepository.save(emergencyStationsPage);
        return ResponseEntity
            .created(new URI("/api/emergency-stations-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emergency-stations-pages/:id} : Updates an existing emergencyStationsPage.
     *
     * @param id the id of the emergencyStationsPage to save.
     * @param emergencyStationsPage the emergencyStationsPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyStationsPage,
     * or with status {@code 400 (Bad Request)} if the emergencyStationsPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emergencyStationsPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emergency-stations-pages/{id}")
    public ResponseEntity<EmergencyStationsPage> updateEmergencyStationsPage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EmergencyStationsPage emergencyStationsPage
    ) throws URISyntaxException {
        log.debug("REST request to update EmergencyStationsPage : {}, {}", id, emergencyStationsPage);
        if (emergencyStationsPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyStationsPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyStationsPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmergencyStationsPage result = emergencyStationsPageRepository.save(emergencyStationsPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyStationsPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emergency-stations-pages/:id} : Partial updates given fields of an existing emergencyStationsPage, field will ignore if it is null
     *
     * @param id the id of the emergencyStationsPage to save.
     * @param emergencyStationsPage the emergencyStationsPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyStationsPage,
     * or with status {@code 400 (Bad Request)} if the emergencyStationsPage is not valid,
     * or with status {@code 404 (Not Found)} if the emergencyStationsPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the emergencyStationsPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emergency-stations-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmergencyStationsPage> partialUpdateEmergencyStationsPage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EmergencyStationsPage emergencyStationsPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmergencyStationsPage partially : {}, {}", id, emergencyStationsPage);
        if (emergencyStationsPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyStationsPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyStationsPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmergencyStationsPage> result = emergencyStationsPageRepository
            .findById(emergencyStationsPage.getId())
            .map(existingEmergencyStationsPage -> {
                if (emergencyStationsPage.getName() != null) {
                    existingEmergencyStationsPage.setName(emergencyStationsPage.getName());
                }
                if (emergencyStationsPage.getStationType() != null) {
                    existingEmergencyStationsPage.setStationType(emergencyStationsPage.getStationType());
                }
                if (emergencyStationsPage.getLatitude() != null) {
                    existingEmergencyStationsPage.setLatitude(emergencyStationsPage.getLatitude());
                }
                if (emergencyStationsPage.getLongitude() != null) {
                    existingEmergencyStationsPage.setLongitude(emergencyStationsPage.getLongitude());
                }

                return existingEmergencyStationsPage;
            })
            .map(emergencyStationsPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyStationsPage.getId().toString())
        );
    }

    /**
     * {@code GET  /emergency-stations-pages} : get all the emergencyStationsPages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emergencyStationsPages in body.
     */
    @GetMapping("/emergency-stations-pages")
    public ResponseEntity<List<EmergencyStationsPage>> getAllEmergencyStationsPages(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of EmergencyStationsPages");
        Page<EmergencyStationsPage> page = emergencyStationsPageRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /emergency-stations-pages/:id} : get the "id" emergencyStationsPage.
     *
     * @param id the id of the emergencyStationsPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emergencyStationsPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emergency-stations-pages/{id}")
    public ResponseEntity<EmergencyStationsPage> getEmergencyStationsPage(@PathVariable Long id) {
        log.debug("REST request to get EmergencyStationsPage : {}", id);
        Optional<EmergencyStationsPage> emergencyStationsPage = emergencyStationsPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emergencyStationsPage);
    }

    /**
     * {@code DELETE  /emergency-stations-pages/:id} : delete the "id" emergencyStationsPage.
     *
     * @param id the id of the emergencyStationsPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emergency-stations-pages/{id}")
    public ResponseEntity<Void> deleteEmergencyStationsPage(@PathVariable Long id) {
        log.debug("REST request to delete EmergencyStationsPage : {}", id);
        emergencyStationsPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
