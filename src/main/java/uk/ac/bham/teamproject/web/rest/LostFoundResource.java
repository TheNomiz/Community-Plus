package uk.ac.bham.teamproject.web.rest;

import io.undertow.util.BadRequestException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.LostFound;
import uk.ac.bham.teamproject.repository.LostFoundRepository;
import uk.ac.bham.teamproject.service.LostFoundService;

/**
 * REST controller for managing {@link LostFound}.
 */
@RestController
@RequestMapping("/api")
public class LostFoundResource {

    private final Logger log = LoggerFactory.getLogger(LostFoundResource.class);

    private static final String ENTITY_NAME = "lostFound";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LostFoundService lostFoundService;

    private final LostFoundRepository lostFoundRepository;

    public LostFoundResource(LostFoundService lostFoundService, LostFoundRepository lostFoundRepository) {
        this.lostFoundService = lostFoundService;
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
    public ResponseEntity<LostFound> createLostFound(@Valid @RequestBody LostFound lostFound)
        throws URISyntaxException, BadRequestException {
        log.debug("REST request to save LostFound : {}", lostFound);
        if (lostFound.getId() != null) {
            throw new BadRequestException("A new lostFound cannot already have an ID");
        }
        LostFound result = lostFoundService.save(lostFound);
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
    ) throws URISyntaxException, BadRequestException {
        log.debug("REST request to update LostFound : {}, {}", id, lostFound);
        if (lostFound.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, lostFound.getId())) {
            throw new BadRequestException("Invalid id");
        }

        if (!lostFoundRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        LostFound result = lostFoundService.update(lostFound);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lostFound.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /lost-founds} : get all the lostFounds.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lostFounds in body.
     */
    @GetMapping("/lost-founds")
    public ResponseEntity<List<LostFound>> getAllLostFounds(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LostFounds");
        Page<LostFound> page = lostFoundService.findAll(pageable);
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
        Optional<LostFound> lostFound = lostFoundService.findOne(id);
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
        lostFoundService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/lost-founds/filter")
    public List<LostFound> filterLostFound(
        @RequestParam(name = "item") String item,
        @RequestParam(name = "date") String date,
        @RequestParam(name = "location") String location
    ) throws ParseException {
        log.debug("REST request to get all filtered Problemas");
        item = item.isEmpty() ? null : item;
        location = location.isEmpty() ? null : location;
        List<LostFound> lostFoundList = lostFoundRepository.getByFilters(item, location);
        if (!date.isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = setTimeToBeginningOfDay(sdf.parse(date));
            Date endDate = setTimeToEndOfDay(sdf.parse(date));
            lostFoundList =
                lostFoundList
                    .stream()
                    .filter(lostFound ->
                        lostFound.getDate().isAfter(startDate.toInstant()) && lostFound.getDate().isBefore(endDate.toInstant())
                    )
                    .collect(Collectors.toList());
        }

        return lostFoundList;
    }

    public static Date setTimeToBeginningOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public static Date setTimeToEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }
}
