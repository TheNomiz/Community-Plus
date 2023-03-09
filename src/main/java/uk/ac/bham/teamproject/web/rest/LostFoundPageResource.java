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
import uk.ac.bham.teamproject.domain.LostFoundPage;
import uk.ac.bham.teamproject.repository.LostFoundPageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.LostFoundPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LostFoundPageResource {

    private final Logger log = LoggerFactory.getLogger(LostFoundPageResource.class);

    private static final String ENTITY_NAME = "lostFoundPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LostFoundPageRepository lostFoundPageRepository;

    public LostFoundPageResource(LostFoundPageRepository lostFoundPageRepository) {
        this.lostFoundPageRepository = lostFoundPageRepository;
    }

    /**
     * {@code POST  /lost-found-pages} : Create a new lostFoundPage.
     *
     * @param lostFoundPage the lostFoundPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lostFoundPage, or with status {@code 400 (Bad Request)} if the lostFoundPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lost-found-pages")
    public ResponseEntity<LostFoundPage> createLostFoundPage(@Valid @RequestBody LostFoundPage lostFoundPage) throws URISyntaxException {
        log.debug("REST request to save LostFoundPage : {}", lostFoundPage);
        if (lostFoundPage.getId() != null) {
            throw new BadRequestAlertException("A new lostFoundPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LostFoundPage result = lostFoundPageRepository.save(lostFoundPage);
        return ResponseEntity
            .created(new URI("/api/lost-found-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lost-found-pages/:id} : Updates an existing lostFoundPage.
     *
     * @param id the id of the lostFoundPage to save.
     * @param lostFoundPage the lostFoundPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lostFoundPage,
     * or with status {@code 400 (Bad Request)} if the lostFoundPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lostFoundPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lost-found-pages/{id}")
    public ResponseEntity<LostFoundPage> updateLostFoundPage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LostFoundPage lostFoundPage
    ) throws URISyntaxException {
        log.debug("REST request to update LostFoundPage : {}, {}", id, lostFoundPage);
        if (lostFoundPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lostFoundPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lostFoundPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LostFoundPage result = lostFoundPageRepository.save(lostFoundPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lostFoundPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lost-found-pages/:id} : Partial updates given fields of an existing lostFoundPage, field will ignore if it is null
     *
     * @param id the id of the lostFoundPage to save.
     * @param lostFoundPage the lostFoundPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lostFoundPage,
     * or with status {@code 400 (Bad Request)} if the lostFoundPage is not valid,
     * or with status {@code 404 (Not Found)} if the lostFoundPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the lostFoundPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lost-found-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LostFoundPage> partialUpdateLostFoundPage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LostFoundPage lostFoundPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update LostFoundPage partially : {}, {}", id, lostFoundPage);
        if (lostFoundPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lostFoundPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lostFoundPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LostFoundPage> result = lostFoundPageRepository
            .findById(lostFoundPage.getId())
            .map(existingLostFoundPage -> {
                if (lostFoundPage.getDescription() != null) {
                    existingLostFoundPage.setDescription(lostFoundPage.getDescription());
                }

                return existingLostFoundPage;
            })
            .map(lostFoundPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lostFoundPage.getId().toString())
        );
    }

    /**
     * {@code GET  /lost-found-pages} : get all the lostFoundPages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lostFoundPages in body.
     */
    @GetMapping("/lost-found-pages")
    public ResponseEntity<List<LostFoundPage>> getAllLostFoundPages(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LostFoundPages");
        Page<LostFoundPage> page = lostFoundPageRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lost-found-pages/:id} : get the "id" lostFoundPage.
     *
     * @param id the id of the lostFoundPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lostFoundPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lost-found-pages/{id}")
    public ResponseEntity<LostFoundPage> getLostFoundPage(@PathVariable Long id) {
        log.debug("REST request to get LostFoundPage : {}", id);
        Optional<LostFoundPage> lostFoundPage = lostFoundPageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lostFoundPage);
    }

    /**
     * {@code DELETE  /lost-found-pages/:id} : delete the "id" lostFoundPage.
     *
     * @param id the id of the lostFoundPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lost-found-pages/{id}")
    public ResponseEntity<Void> deleteLostFoundPage(@PathVariable Long id) {
        log.debug("REST request to delete LostFoundPage : {}", id);
        lostFoundPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
