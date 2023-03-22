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
import uk.ac.bham.teamproject.domain.LostFound;
import uk.ac.bham.teamproject.repository.LostFoundRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.LostFound}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LostFoundResource {

    private final Logger log = LoggerFactory.getLogger(LostFoundResource.class);

    private static final String ENTITY_NAME = "lostFound";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LostFoundRepository lostFoundRepository;

    public LostFoundResource(LostFoundRepository lostFoundRepository) {
        this.lostFoundRepository = lostFoundRepository;
    }

    /**
     * {@code POST  /lost-founds} : Create a new lostFound.
     *
     * @param lostFound the lostFound to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lostFound, or with status {@code 400 (Bad Request)} if the lostFound has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lost-founds")
    public ResponseEntity<LostFound> createLostFound(@Valid @RequestBody LostFound lostFound) throws URISyntaxException {
        log.debug("REST request to save LostFound : {}", lostFound);
        if (lostFound.getId() != null) {
            throw new BadRequestAlertException("A new lostFound cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LostFound result = lostFoundRepository.save(lostFound);
        return ResponseEntity
            .created(new URI("/api/lost-founds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lost-founds/:id} : Updates an existing lostFound.
     *
     * @param id the id of the lostFound to save.
     * @param lostFound the lostFound to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lostFound,
     * or with status {@code 400 (Bad Request)} if the lostFound is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lostFound couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lost-founds/{id}")
    public ResponseEntity<LostFound> updateLostFound(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LostFound lostFound
    ) throws URISyntaxException {
        log.debug("REST request to update LostFound : {}, {}", id, lostFound);
        if (lostFound.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lostFound.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lostFoundRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LostFound result = lostFoundRepository.save(lostFound);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lostFound.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lost-founds/:id} : Partial updates given fields of an existing lostFound, field will ignore if it is null
     *
     * @param id the id of the lostFound to save.
     * @param lostFound the lostFound to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lostFound,
     * or with status {@code 400 (Bad Request)} if the lostFound is not valid,
     * or with status {@code 404 (Not Found)} if the lostFound is not found,
     * or with status {@code 500 (Internal Server Error)} if the lostFound couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lost-founds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LostFound> partialUpdateLostFound(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LostFound lostFound
    ) throws URISyntaxException {
        log.debug("REST request to partial update LostFound partially : {}, {}", id, lostFound);
        if (lostFound.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lostFound.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lostFoundRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LostFound> result = lostFoundRepository
            .findById(lostFound.getId())
            .map(existingLostFound -> {
                if (lostFound.getDescription() != null) {
                    existingLostFound.setDescription(lostFound.getDescription());
                }
                if (lostFound.getDate() != null) {
                    existingLostFound.setDate(lostFound.getDate());
                }
                if (lostFound.getLocation() != null) {
                    existingLostFound.setLocation(lostFound.getLocation());
                }
                if (lostFound.getItem() != null) {
                    existingLostFound.setItem(lostFound.getItem());
                }
                if (lostFound.getName() != null) {
                    existingLostFound.setName(lostFound.getName());
                }
                if (lostFound.getEmail() != null) {
                    existingLostFound.setEmail(lostFound.getEmail());
                }
                if (lostFound.getPhoneNumber() != null) {
                    existingLostFound.setPhoneNumber(lostFound.getPhoneNumber());
                }

                return existingLostFound;
            })
            .map(lostFoundRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lostFound.getId().toString())
        );
    }

    /**
     * {@code GET  /lost-founds} : get all the lostFounds.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lostFounds in body.
     */
    @GetMapping("/lost-founds")
    public ResponseEntity<List<LostFound>> getAllLostFounds(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of LostFounds");
        Page<LostFound> page;
        if (eagerload) {
            page = lostFoundRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = lostFoundRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lost-founds/:id} : get the "id" lostFound.
     *
     * @param id the id of the lostFound to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lostFound, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lost-founds/{id}")
    public ResponseEntity<LostFound> getLostFound(@PathVariable Long id) {
        log.debug("REST request to get LostFound : {}", id);
        Optional<LostFound> lostFound = lostFoundRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(lostFound);
    }

    /**
     * {@code DELETE  /lost-founds/:id} : delete the "id" lostFound.
     *
     * @param id the id of the lostFound to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lost-founds/{id}")
    public ResponseEntity<Void> deleteLostFound(@PathVariable Long id) {
        log.debug("REST request to delete LostFound : {}", id);
        lostFoundRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
