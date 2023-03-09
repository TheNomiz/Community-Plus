package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.EmergencyStationsPage;
import uk.ac.bham.teamproject.repository.EmergencyStationsPageRepository;

/**
 * Integration tests for the {@link EmergencyStationsPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmergencyStationsPageResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STATION_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_STATION_TYPE = "BBBBBBBBBB";

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final String ENTITY_API_URL = "/api/emergency-stations-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmergencyStationsPageRepository emergencyStationsPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmergencyStationsPageMockMvc;

    private EmergencyStationsPage emergencyStationsPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyStationsPage createEntity(EntityManager em) {
        EmergencyStationsPage emergencyStationsPage = new EmergencyStationsPage()
            .name(DEFAULT_NAME)
            .stationType(DEFAULT_STATION_TYPE)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE);
        return emergencyStationsPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyStationsPage createUpdatedEntity(EntityManager em) {
        EmergencyStationsPage emergencyStationsPage = new EmergencyStationsPage()
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);
        return emergencyStationsPage;
    }

    @BeforeEach
    public void initTest() {
        emergencyStationsPage = createEntity(em);
    }

    @Test
    @Transactional
    void createEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeCreate = emergencyStationsPageRepository.findAll().size();
        // Create the EmergencyStationsPage
        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isCreated());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeCreate + 1);
        EmergencyStationsPage testEmergencyStationsPage = emergencyStationsPageList.get(emergencyStationsPageList.size() - 1);
        assertThat(testEmergencyStationsPage.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEmergencyStationsPage.getStationType()).isEqualTo(DEFAULT_STATION_TYPE);
        assertThat(testEmergencyStationsPage.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testEmergencyStationsPage.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
    }

    @Test
    @Transactional
    void createEmergencyStationsPageWithExistingId() throws Exception {
        // Create the EmergencyStationsPage with an existing ID
        emergencyStationsPage.setId(1L);

        int databaseSizeBeforeCreate = emergencyStationsPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsPageRepository.findAll().size();
        // set the field null
        emergencyStationsPage.setName(null);

        // Create the EmergencyStationsPage, which fails.

        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStationTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsPageRepository.findAll().size();
        // set the field null
        emergencyStationsPage.setStationType(null);

        // Create the EmergencyStationsPage, which fails.

        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsPageRepository.findAll().size();
        // set the field null
        emergencyStationsPage.setLatitude(null);

        // Create the EmergencyStationsPage, which fails.

        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsPageRepository.findAll().size();
        // set the field null
        emergencyStationsPage.setLongitude(null);

        // Create the EmergencyStationsPage, which fails.

        restEmergencyStationsPageMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmergencyStationsPages() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        // Get all the emergencyStationsPageList
        restEmergencyStationsPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emergencyStationsPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].stationType").value(hasItem(DEFAULT_STATION_TYPE)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())));
    }

    @Test
    @Transactional
    void getEmergencyStationsPage() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        // Get the emergencyStationsPage
        restEmergencyStationsPageMockMvc
            .perform(get(ENTITY_API_URL_ID, emergencyStationsPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emergencyStationsPage.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.stationType").value(DEFAULT_STATION_TYPE))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingEmergencyStationsPage() throws Exception {
        // Get the emergencyStationsPage
        restEmergencyStationsPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmergencyStationsPage() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();

        // Update the emergencyStationsPage
        EmergencyStationsPage updatedEmergencyStationsPage = emergencyStationsPageRepository.findById(emergencyStationsPage.getId()).get();
        // Disconnect from session so that the updates on updatedEmergencyStationsPage are not directly saved in db
        em.detach(updatedEmergencyStationsPage);
        updatedEmergencyStationsPage
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restEmergencyStationsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmergencyStationsPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmergencyStationsPage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStationsPage testEmergencyStationsPage = emergencyStationsPageList.get(emergencyStationsPageList.size() - 1);
        assertThat(testEmergencyStationsPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyStationsPage.getStationType()).isEqualTo(UPDATED_STATION_TYPE);
        assertThat(testEmergencyStationsPage.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testEmergencyStationsPage.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void putNonExistingEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emergencyStationsPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmergencyStationsPageWithPatch() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();

        // Update the emergencyStationsPage using partial update
        EmergencyStationsPage partialUpdatedEmergencyStationsPage = new EmergencyStationsPage();
        partialUpdatedEmergencyStationsPage.setId(emergencyStationsPage.getId());

        partialUpdatedEmergencyStationsPage.name(UPDATED_NAME).latitude(UPDATED_LATITUDE).longitude(UPDATED_LONGITUDE);

        restEmergencyStationsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyStationsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyStationsPage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStationsPage testEmergencyStationsPage = emergencyStationsPageList.get(emergencyStationsPageList.size() - 1);
        assertThat(testEmergencyStationsPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyStationsPage.getStationType()).isEqualTo(DEFAULT_STATION_TYPE);
        assertThat(testEmergencyStationsPage.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testEmergencyStationsPage.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void fullUpdateEmergencyStationsPageWithPatch() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();

        // Update the emergencyStationsPage using partial update
        EmergencyStationsPage partialUpdatedEmergencyStationsPage = new EmergencyStationsPage();
        partialUpdatedEmergencyStationsPage.setId(emergencyStationsPage.getId());

        partialUpdatedEmergencyStationsPage
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restEmergencyStationsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyStationsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyStationsPage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStationsPage testEmergencyStationsPage = emergencyStationsPageList.get(emergencyStationsPageList.size() - 1);
        assertThat(testEmergencyStationsPage.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyStationsPage.getStationType()).isEqualTo(UPDATED_STATION_TYPE);
        assertThat(testEmergencyStationsPage.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testEmergencyStationsPage.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void patchNonExistingEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emergencyStationsPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmergencyStationsPage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsPageRepository.findAll().size();
        emergencyStationsPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsPageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStationsPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyStationsPage in the database
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmergencyStationsPage() throws Exception {
        // Initialize the database
        emergencyStationsPageRepository.saveAndFlush(emergencyStationsPage);

        int databaseSizeBeforeDelete = emergencyStationsPageRepository.findAll().size();

        // Delete the emergencyStationsPage
        restEmergencyStationsPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, emergencyStationsPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmergencyStationsPage> emergencyStationsPageList = emergencyStationsPageRepository.findAll();
        assertThat(emergencyStationsPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
