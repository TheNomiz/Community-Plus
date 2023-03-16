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
import uk.ac.bham.teamproject.domain.UserProfile;
import uk.ac.bham.teamproject.repository.UserProfileRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserProfile}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserProfileResource {

    private final Logger log = LoggerFactory.getLogger(UserProfileResource.class);

    private static final String ENTITY_NAME = "userProfile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserProfileRepository userProfileRepository;

    public UserProfileResource(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * {@code POST  /user-profiles} : Create a new userProfile.
     *
     * @param userProfile the userProfile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userProfile, or with status {@code 400 (Bad Request)} if the userProfile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-profiles")
    public ResponseEntity<UserProfile> createUserProfile(@Valid @RequestBody UserProfile userProfile) throws URISyntaxException {
        log.debug("REST request to save UserProfile : {}", userProfile);
        if (userProfile.getId() != null) {
            throw new BadRequestAlertException("A new userProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserProfile result = userProfileRepository.save(userProfile);
        return ResponseEntity
            .created(new URI("/api/user-profiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-profiles/:id} : Updates an existing userProfile.
     *
     * @param id the id of the userProfile to save.
     * @param userProfile the userProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userProfile,
     * or with status {@code 400 (Bad Request)} if the userProfile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-profiles/{id}")
    public ResponseEntity<UserProfile> updateUserProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserProfile userProfile
    ) throws URISyntaxException {
        log.debug("REST request to update UserProfile : {}, {}", id, userProfile);
        if (userProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserProfile result = userProfileRepository.save(userProfile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userProfile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-profiles/:id} : Partial updates given fields of an existing userProfile, field will ignore if it is null
     *
     * @param id the id of the userProfile to save.
     * @param userProfile the userProfile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userProfile,
     * or with status {@code 400 (Bad Request)} if the userProfile is not valid,
     * or with status {@code 404 (Not Found)} if the userProfile is not found,
     * or with status {@code 500 (Internal Server Error)} if the userProfile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-profiles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserProfile> partialUpdateUserProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserProfile userProfile
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserProfile partially : {}, {}", id, userProfile);
        if (userProfile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userProfile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserProfile> result = userProfileRepository
            .findById(userProfile.getId())
            .map(existingUserProfile -> {
                if (userProfile.getUsername() != null) {
                    existingUserProfile.setUsername(userProfile.getUsername());
                }
                if (userProfile.getVerified() != null) {
                    existingUserProfile.setVerified(userProfile.getVerified());
                }
                if (userProfile.getPrivateAccount() != null) {
                    existingUserProfile.setPrivateAccount(userProfile.getPrivateAccount());
                }
                if (userProfile.getAge() != null) {
                    existingUserProfile.setAge(userProfile.getAge());
                }
                if (userProfile.getAccountType() != null) {
                    existingUserProfile.setAccountType(userProfile.getAccountType());
                }
                if (userProfile.getFirstnames() != null) {
                    existingUserProfile.setFirstnames(userProfile.getFirstnames());
                }
                if (userProfile.getLastname() != null) {
                    existingUserProfile.setLastname(userProfile.getLastname());
                }
                if (userProfile.getPassword() != null) {
                    existingUserProfile.setPassword(userProfile.getPassword());
                }
                if (userProfile.getOccupation() != null) {
                    existingUserProfile.setOccupation(userProfile.getOccupation());
                }
                if (userProfile.getStreetAddress() != null) {
                    existingUserProfile.setStreetAddress(userProfile.getStreetAddress());
                }
                if (userProfile.getCity() != null) {
                    existingUserProfile.setCity(userProfile.getCity());
                }
                if (userProfile.getPostalCode() != null) {
                    existingUserProfile.setPostalCode(userProfile.getPostalCode());
                }
                if (userProfile.getBio() != null) {
                    existingUserProfile.setBio(userProfile.getBio());
                }
                if (userProfile.getEmail() != null) {
                    existingUserProfile.setEmail(userProfile.getEmail());
                }
                if (userProfile.getPhoneNumber() != null) {
                    existingUserProfile.setPhoneNumber(userProfile.getPhoneNumber());
                }
                if (userProfile.getCommunityPoints() != null) {
                    existingUserProfile.setCommunityPoints(userProfile.getCommunityPoints());
                }
                if (userProfile.getLanguage() != null) {
                    existingUserProfile.setLanguage(userProfile.getLanguage());
                }
                if (userProfile.getgPS() != null) {
                    existingUserProfile.setgPS(userProfile.getgPS());
                }
                if (userProfile.getDarkmode() != null) {
                    existingUserProfile.setDarkmode(userProfile.getDarkmode());
                }
                if (userProfile.getFontsize() != null) {
                    existingUserProfile.setFontsize(userProfile.getFontsize());
                }

                return existingUserProfile;
            })
            .map(userProfileRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userProfile.getId().toString())
        );
    }

    /**
     * {@code GET  /user-profiles} : get all the userProfiles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userProfiles in body.
     */
    @GetMapping("/user-profiles")
    public ResponseEntity<List<UserProfile>> getAllUserProfiles(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of UserProfiles");
        Page<UserProfile> page = userProfileRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-profiles/:id} : get the "id" userProfile.
     *
     * @param id the id of the userProfile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userProfile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-profiles/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        log.debug("REST request to get UserProfile : {}", id);
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userProfile);
    }

    /**
     * {@code DELETE  /user-profiles/:id} : delete the "id" userProfile.
     *
     * @param id the id of the userProfile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-profiles/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long id) {
        log.debug("REST request to delete UserProfile : {}", id);
        userProfileRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}