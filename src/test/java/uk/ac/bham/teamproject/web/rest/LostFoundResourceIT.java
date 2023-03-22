package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.LostFound;
import uk.ac.bham.teamproject.repository.LostFoundRepository;

/**
 * Integration tests for the {@link LostFoundResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LostFoundResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_ITEM = "AAAAAAAAAA";
    private static final String UPDATED_ITEM = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lost-founds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LostFoundRepository lostFoundRepository;

    @Mock
    private LostFoundRepository lostFoundRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLostFoundMockMvc;

    private LostFound lostFound;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LostFound createEntity(EntityManager em) {
        LostFound lostFound = new LostFound()
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .location(DEFAULT_LOCATION)
            .item(DEFAULT_ITEM)
            .name(DEFAULT_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER);
        return lostFound;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LostFound createUpdatedEntity(EntityManager em) {
        LostFound lostFound = new LostFound()
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .location(UPDATED_LOCATION)
            .item(UPDATED_ITEM)
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);
        return lostFound;
    }

    @BeforeEach
    public void initTest() {
        lostFound = createEntity(em);
    }

    @Test
    @Transactional
    void createLostFound() throws Exception {
        int databaseSizeBeforeCreate = lostFoundRepository.findAll().size();
        // Create the LostFound
        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isCreated());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeCreate + 1);
        LostFound testLostFound = lostFoundList.get(lostFoundList.size() - 1);
        assertThat(testLostFound.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLostFound.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testLostFound.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLostFound.getItem()).isEqualTo(DEFAULT_ITEM);
        assertThat(testLostFound.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLostFound.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testLostFound.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void createLostFoundWithExistingId() throws Exception {
        // Create the LostFound with an existing ID
        lostFound.setId(1L);

        int databaseSizeBeforeCreate = lostFoundRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setDescription(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setDate(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLocationIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setLocation(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkItemIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setItem(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setName(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setEmail(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundRepository.findAll().size();
        // set the field null
        lostFound.setPhoneNumber(null);

        // Create the LostFound, which fails.

        restLostFoundMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isBadRequest());

        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLostFounds() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        // Get all the lostFoundList
        restLostFoundMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lostFound.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].item").value(hasItem(DEFAULT_ITEM)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLostFoundsWithEagerRelationshipsIsEnabled() throws Exception {
        when(lostFoundRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLostFoundMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(lostFoundRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLostFoundsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(lostFoundRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLostFoundMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(lostFoundRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLostFound() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        // Get the lostFound
        restLostFoundMockMvc
            .perform(get(ENTITY_API_URL_ID, lostFound.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lostFound.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.item").value(DEFAULT_ITEM))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingLostFound() throws Exception {
        // Get the lostFound
        restLostFoundMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLostFound() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();

        // Update the lostFound
        LostFound updatedLostFound = lostFoundRepository.findById(lostFound.getId()).get();
        // Disconnect from session so that the updates on updatedLostFound are not directly saved in db
        em.detach(updatedLostFound);
        updatedLostFound
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .location(UPDATED_LOCATION)
            .item(UPDATED_ITEM)
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restLostFoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLostFound.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLostFound))
            )
            .andExpect(status().isOk());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
        LostFound testLostFound = lostFoundList.get(lostFoundList.size() - 1);
        assertThat(testLostFound.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLostFound.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLostFound.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLostFound.getItem()).isEqualTo(UPDATED_ITEM);
        assertThat(testLostFound.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLostFound.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLostFound.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lostFound.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lostFound))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lostFound))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFound)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLostFoundWithPatch() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();

        // Update the lostFound using partial update
        LostFound partialUpdatedLostFound = new LostFound();
        partialUpdatedLostFound.setId(lostFound.getId());

        partialUpdatedLostFound
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .item(UPDATED_ITEM)
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restLostFoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLostFound.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLostFound))
            )
            .andExpect(status().isOk());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
        LostFound testLostFound = lostFoundList.get(lostFoundList.size() - 1);
        assertThat(testLostFound.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLostFound.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLostFound.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testLostFound.getItem()).isEqualTo(UPDATED_ITEM);
        assertThat(testLostFound.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLostFound.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLostFound.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateLostFoundWithPatch() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();

        // Update the lostFound using partial update
        LostFound partialUpdatedLostFound = new LostFound();
        partialUpdatedLostFound.setId(lostFound.getId());

        partialUpdatedLostFound
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .location(UPDATED_LOCATION)
            .item(UPDATED_ITEM)
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restLostFoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLostFound.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLostFound))
            )
            .andExpect(status().isOk());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
        LostFound testLostFound = lostFoundList.get(lostFoundList.size() - 1);
        assertThat(testLostFound.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLostFound.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLostFound.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testLostFound.getItem()).isEqualTo(UPDATED_ITEM);
        assertThat(testLostFound.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLostFound.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLostFound.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lostFound.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lostFound))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lostFound))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLostFound() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundRepository.findAll().size();
        lostFound.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lostFound))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LostFound in the database
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLostFound() throws Exception {
        // Initialize the database
        lostFoundRepository.saveAndFlush(lostFound);

        int databaseSizeBeforeDelete = lostFoundRepository.findAll().size();

        // Delete the lostFound
        restLostFoundMockMvc
            .perform(delete(ENTITY_API_URL_ID, lostFound.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LostFound> lostFoundList = lostFoundRepository.findAll();
        assertThat(lostFoundList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
