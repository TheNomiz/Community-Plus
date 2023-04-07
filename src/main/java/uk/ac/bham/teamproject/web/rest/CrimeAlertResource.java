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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.service.CrimeAlertQueryService;
import uk.ac.bham.teamproject.service.CrimeAlertService;
import uk.ac.bham.teamproject.service.criteria.CrimeAlertCriteria;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.CrimeAlert}.
 */
@RestController
@RequestMapping("/api")
public class CrimeAlertResource {

    private final Logger log = LoggerFactory.getLogger(CrimeAlertResource.class);

    private static final String ENTITY_NAME = "crimeAlert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CrimeAlertService crimeAlertService;

    private final CrimeAlertRepository crimeAlertRepository;

    private final CrimeAlertQueryService crimeAlertQueryService;

    public CrimeAlertResource(
        CrimeAlertService crimeAlertService,
        CrimeAlertRepository crimeAlertRepository,
        CrimeAlertQueryService crimeAlertQueryService
    ) {
        this.crimeAlertService = crimeAlertService;
        this.crimeAlertRepository = crimeAlertRepository;
        this.crimeAlertQueryService = crimeAlertQueryService;
    }

    /**
     * {@code POST  /crime-alerts} : Create a new crimeAlert.
     *
     * @param crimeAlertDTO the crimeAlertDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new crimeAlertDTO, or with status {@code 400 (Bad Request)} if the crimeAlert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/crime-alerts")
    public ResponseEntity<CrimeAlertDTO> createCrimeAlert(@Valid @RequestBody CrimeAlertDTO crimeAlertDTO) throws URISyntaxException {
        log.debug("REST request to save CrimeAlert : {}", crimeAlertDTO);
        if (crimeAlertDTO.getId() != null) {
            throw new BadRequestAlertException("A new crimeAlert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CrimeAlertDTO result = crimeAlertService.save(crimeAlertDTO);
        return ResponseEntity
            .created(new URI("/api/crime-alerts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /crime-alerts/:id} : Updates an existing crimeAlert.
     *
     * @param id the id of the crimeAlertDTO to save.
     * @param crimeAlertDTO the crimeAlertDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated crimeAlertDTO,
     * or with status {@code 400 (Bad Request)} if the crimeAlertDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the crimeAlertDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Secured("ROLE_ADMIN")
    @PutMapping("/crime-alerts/{id}")
    public ResponseEntity<CrimeAlertDTO> updateCrimeAlert(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CrimeAlertDTO crimeAlertDTO
    ) throws URISyntaxException {
        log.debug("REST request to update CrimeAlert : {}, {}", id, crimeAlertDTO);
        if (crimeAlertDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, crimeAlertDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!crimeAlertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CrimeAlertDTO result = crimeAlertService.update(crimeAlertDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, crimeAlertDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /crime-alerts/:id} : Partial updates given fields of an existing crimeAlert, field will ignore if it is null
     *
     * @param id the id of the crimeAlertDTO to save.
     * @param crimeAlertDTO the crimeAlertDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated crimeAlertDTO,
     * or with status {@code 400 (Bad Request)} if the crimeAlertDTO is not valid,
     * or with status {@code 404 (Not Found)} if the crimeAlertDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the crimeAlertDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/crime-alerts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CrimeAlertDTO> partialUpdateCrimeAlert(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CrimeAlertDTO crimeAlertDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update CrimeAlert partially : {}, {}", id, crimeAlertDTO);
        if (crimeAlertDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, crimeAlertDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!crimeAlertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CrimeAlertDTO> result = crimeAlertService.partialUpdate(crimeAlertDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, crimeAlertDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /crime-alerts} : get all the crimeAlerts.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of crimeAlerts in body.
     */
    @GetMapping("/crime-alerts")
    public ResponseEntity<List<CrimeAlertDTO>> getAllCrimeAlerts(
        CrimeAlertCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get CrimeAlerts by criteria: {}", criteria);
        Page<CrimeAlertDTO> page = crimeAlertQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /crime-alerts/count} : count all the crimeAlerts.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/crime-alerts/count")
    public ResponseEntity<Long> countCrimeAlerts(CrimeAlertCriteria criteria) {
        log.debug("REST request to count CrimeAlerts by criteria: {}", criteria);
        return ResponseEntity.ok().body(crimeAlertQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /crime-alerts/:id} : get the "id" crimeAlert.
     *
     * @param id the id of the crimeAlertDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the crimeAlertDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/crime-alerts/{id}")
    public ResponseEntity<CrimeAlertDTO> getCrimeAlert(@PathVariable Long id) {
        log.debug("REST request to get CrimeAlert : {}", id);
        Optional<CrimeAlertDTO> crimeAlertDTO = crimeAlertService.findOne(id);
        return ResponseUtil.wrapOrNotFound(crimeAlertDTO);
    }

    /**
     * {@code DELETE  /crime-alerts/:id} : delete the "id" crimeAlert.
     *
     * @param id the id of the crimeAlertDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/crime-alerts/{id}")
    public ResponseEntity<Void> deleteCrimeAlert(@PathVariable Long id) {
        log.debug("REST request to delete CrimeAlert : {}", id);
        crimeAlertService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
