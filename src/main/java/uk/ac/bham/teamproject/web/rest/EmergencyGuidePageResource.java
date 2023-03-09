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
import uk.ac.bham.teamproject.domain.EmergencyGuidePage;
import uk.ac.bham.teamproject.repository.EmergencyGuidePageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.EmergencyGuidePage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmergencyGuidePageResource {

    private final Logger log = LoggerFactory.getLogger(EmergencyGuidePageResource.class);

    private static final String ENTITY_NAME = "emergencyGuidePage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmergencyGuidePageRepository emergencyGuidePageRepository;

    public EmergencyGuidePageResource(EmergencyGuidePageRepository emergencyGuidePageRepository) {
        this.emergencyGuidePageRepository = emergencyGuidePageRepository;
    }

    /**
     * {@code POST  /emergency-guide-pages} : Create a new emergencyGuidePage.
     *
     * @param emergencyGuidePage the emergencyGuidePage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emergencyGuidePage, or with status {@code 400 (Bad Request)} if the emergencyGuidePage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emergency-guide-pages")
    public ResponseEntity<EmergencyGuidePage> createEmergencyGuidePage(@Valid @RequestBody EmergencyGuidePage emergencyGuidePage)
        throws URISyntaxException {
        log.debug("REST request to save EmergencyGuidePage : {}", emergencyGuidePage);
        if (emergencyGuidePage.getId() != null) {
            throw new BadRequestAlertException("A new emergencyGuidePage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmergencyGuidePage result = emergencyGuidePageRepository.save(emergencyGuidePage);
        return ResponseEntity
            .created(new URI("/api/emergency-guide-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emergency-guide-pages/:id} : Updates an existing emergencyGuidePage.
     *
     * @param id the id of the emergencyGuidePage to save.
     * @param emergencyGuidePage the emergencyGuidePage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyGuidePage,
     * or with status {@code 400 (Bad Request)} if the emergencyGuidePage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emergencyGuidePage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emergency-guide-pages/{id}")
    public ResponseEntity<EmergencyGuidePage> updateEmergencyGuidePage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EmergencyGuidePage emergencyGuidePage
    ) throws URISyntaxException {
        log.debug("REST request to update EmergencyGuidePage : {}, {}", id, emergencyGuidePage);
        if (emergencyGuidePage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyGuidePage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyGuidePageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmergencyGuidePage result = emergencyGuidePageRepository.save(emergencyGuidePage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyGuidePage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emergency-guide-pages/:id} : Partial updates given fields of an existing emergencyGuidePage, field will ignore if it is null
     *
     * @param id the id of the emergencyGuidePage to save.
     * @param emergencyGuidePage the emergencyGuidePage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyGuidePage,
     * or with status {@code 400 (Bad Request)} if the emergencyGuidePage is not valid,
     * or with status {@code 404 (Not Found)} if the emergencyGuidePage is not found,
     * or with status {@code 500 (Internal Server Error)} if the emergencyGuidePage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emergency-guide-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmergencyGuidePage> partialUpdateEmergencyGuidePage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EmergencyGuidePage emergencyGuidePage
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmergencyGuidePage partially : {}, {}", id, emergencyGuidePage);
        if (emergencyGuidePage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyGuidePage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyGuidePageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmergencyGuidePage> result = emergencyGuidePageRepository
            .findById(emergencyGuidePage.getId())
            .map(existingEmergencyGuidePage -> {
                if (emergencyGuidePage.getEmergencyType() != null) {
                    existingEmergencyGuidePage.setEmergencyType(emergencyGuidePage.getEmergencyType());
                }

                return existingEmergencyGuidePage;
            })
            .map(emergencyGuidePageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyGuidePage.getId().toString())
        );
    }

    /**
     * {@code GET  /emergency-guide-pages} : get all the emergencyGuidePages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emergencyGuidePages in body.
     */
    @GetMapping("/emergency-guide-pages")
    public ResponseEntity<List<EmergencyGuidePage>> getAllEmergencyGuidePages(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of EmergencyGuidePages");
        Page<EmergencyGuidePage> page = emergencyGuidePageRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /emergency-guide-pages/:id} : get the "id" emergencyGuidePage.
     *
     * @param id the id of the emergencyGuidePage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emergencyGuidePage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emergency-guide-pages/{id}")
    public ResponseEntity<EmergencyGuidePage> getEmergencyGuidePage(@PathVariable Long id) {
        log.debug("REST request to get EmergencyGuidePage : {}", id);
        Optional<EmergencyGuidePage> emergencyGuidePage = emergencyGuidePageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emergencyGuidePage);
    }

    /**
     * {@code DELETE  /emergency-guide-pages/:id} : delete the "id" emergencyGuidePage.
     *
     * @param id the id of the emergencyGuidePage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emergency-guide-pages/{id}")
    public ResponseEntity<Void> deleteEmergencyGuidePage(@PathVariable Long id) {
        log.debug("REST request to delete EmergencyGuidePage : {}", id);
        emergencyGuidePageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
