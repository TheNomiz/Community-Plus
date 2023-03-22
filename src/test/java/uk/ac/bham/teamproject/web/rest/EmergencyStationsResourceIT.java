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
import uk.ac.bham.teamproject.domain.EmergencyStations;
import uk.ac.bham.teamproject.domain.enumeration.StationsCategory;
import uk.ac.bham.teamproject.repository.EmergencyStationsRepository;

/**
 * Integration tests for the {@link EmergencyStationsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmergencyStationsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final StationsCategory DEFAULT_STATION_TYPE = StationsCategory.PoliceStation;
    private static final StationsCategory UPDATED_STATION_TYPE = StationsCategory.Hospital;

    private static final Boolean DEFAULT_WHEELCHAIR_ACCESS = false;
    private static final Boolean UPDATED_WHEELCHAIR_ACCESS = true;

    private static final Boolean DEFAULT_PARKING = false;
    private static final Boolean UPDATED_PARKING = true;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final String ENTITY_API_URL = "/api/emergency-stations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmergencyStationsRepository emergencyStationsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmergencyStationsMockMvc;

    private EmergencyStations emergencyStations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyStations createEntity(EntityManager em) {
        EmergencyStations emergencyStations = new EmergencyStations()
            .name(DEFAULT_NAME)
            .stationType(DEFAULT_STATION_TYPE)
            .wheelchairAccess(DEFAULT_WHEELCHAIR_ACCESS)
            .parking(DEFAULT_PARKING)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE);
        return emergencyStations;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyStations createUpdatedEntity(EntityManager em) {
        EmergencyStations emergencyStations = new EmergencyStations()
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .wheelchairAccess(UPDATED_WHEELCHAIR_ACCESS)
            .parking(UPDATED_PARKING)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);
        return emergencyStations;
    }

    @BeforeEach
    public void initTest() {
        emergencyStations = createEntity(em);
    }

    @Test
    @Transactional
    void createEmergencyStations() throws Exception {
        int databaseSizeBeforeCreate = emergencyStationsRepository.findAll().size();
        // Create the EmergencyStations
        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isCreated());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeCreate + 1);
        EmergencyStations testEmergencyStations = emergencyStationsList.get(emergencyStationsList.size() - 1);
        assertThat(testEmergencyStations.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEmergencyStations.getStationType()).isEqualTo(DEFAULT_STATION_TYPE);
        assertThat(testEmergencyStations.getWheelchairAccess()).isEqualTo(DEFAULT_WHEELCHAIR_ACCESS);
        assertThat(testEmergencyStations.getParking()).isEqualTo(DEFAULT_PARKING);
        assertThat(testEmergencyStations.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testEmergencyStations.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
    }

    @Test
    @Transactional
    void createEmergencyStationsWithExistingId() throws Exception {
        // Create the EmergencyStations with an existing ID
        emergencyStations.setId(1L);

        int databaseSizeBeforeCreate = emergencyStationsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsRepository.findAll().size();
        // set the field null
        emergencyStations.setName(null);

        // Create the EmergencyStations, which fails.

        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStationTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsRepository.findAll().size();
        // set the field null
        emergencyStations.setStationType(null);

        // Create the EmergencyStations, which fails.

        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsRepository.findAll().size();
        // set the field null
        emergencyStations.setLatitude(null);

        // Create the EmergencyStations, which fails.

        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyStationsRepository.findAll().size();
        // set the field null
        emergencyStations.setLongitude(null);

        // Create the EmergencyStations, which fails.

        restEmergencyStationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmergencyStations() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        // Get all the emergencyStationsList
        restEmergencyStationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emergencyStations.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].stationType").value(hasItem(DEFAULT_STATION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].wheelchairAccess").value(hasItem(DEFAULT_WHEELCHAIR_ACCESS.booleanValue())))
            .andExpect(jsonPath("$.[*].parking").value(hasItem(DEFAULT_PARKING.booleanValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())));
    }

    @Test
    @Transactional
    void getEmergencyStations() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        // Get the emergencyStations
        restEmergencyStationsMockMvc
            .perform(get(ENTITY_API_URL_ID, emergencyStations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emergencyStations.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.stationType").value(DEFAULT_STATION_TYPE.toString()))
            .andExpect(jsonPath("$.wheelchairAccess").value(DEFAULT_WHEELCHAIR_ACCESS.booleanValue()))
            .andExpect(jsonPath("$.parking").value(DEFAULT_PARKING.booleanValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingEmergencyStations() throws Exception {
        // Get the emergencyStations
        restEmergencyStationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmergencyStations() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();

        // Update the emergencyStations
        EmergencyStations updatedEmergencyStations = emergencyStationsRepository.findById(emergencyStations.getId()).get();
        // Disconnect from session so that the updates on updatedEmergencyStations are not directly saved in db
        em.detach(updatedEmergencyStations);
        updatedEmergencyStations
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .wheelchairAccess(UPDATED_WHEELCHAIR_ACCESS)
            .parking(UPDATED_PARKING)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restEmergencyStationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmergencyStations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmergencyStations))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStations testEmergencyStations = emergencyStationsList.get(emergencyStationsList.size() - 1);
        assertThat(testEmergencyStations.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyStations.getStationType()).isEqualTo(UPDATED_STATION_TYPE);
        assertThat(testEmergencyStations.getWheelchairAccess()).isEqualTo(UPDATED_WHEELCHAIR_ACCESS);
        assertThat(testEmergencyStations.getParking()).isEqualTo(UPDATED_PARKING);
        assertThat(testEmergencyStations.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testEmergencyStations.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void putNonExistingEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emergencyStations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmergencyStationsWithPatch() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();

        // Update the emergencyStations using partial update
        EmergencyStations partialUpdatedEmergencyStations = new EmergencyStations();
        partialUpdatedEmergencyStations.setId(emergencyStations.getId());

        partialUpdatedEmergencyStations
            .stationType(UPDATED_STATION_TYPE)
            .wheelchairAccess(UPDATED_WHEELCHAIR_ACCESS)
            .parking(UPDATED_PARKING);

        restEmergencyStationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyStations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyStations))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStations testEmergencyStations = emergencyStationsList.get(emergencyStationsList.size() - 1);
        assertThat(testEmergencyStations.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEmergencyStations.getStationType()).isEqualTo(UPDATED_STATION_TYPE);
        assertThat(testEmergencyStations.getWheelchairAccess()).isEqualTo(UPDATED_WHEELCHAIR_ACCESS);
        assertThat(testEmergencyStations.getParking()).isEqualTo(UPDATED_PARKING);
        assertThat(testEmergencyStations.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testEmergencyStations.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
    }

    @Test
    @Transactional
    void fullUpdateEmergencyStationsWithPatch() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();

        // Update the emergencyStations using partial update
        EmergencyStations partialUpdatedEmergencyStations = new EmergencyStations();
        partialUpdatedEmergencyStations.setId(emergencyStations.getId());

        partialUpdatedEmergencyStations
            .name(UPDATED_NAME)
            .stationType(UPDATED_STATION_TYPE)
            .wheelchairAccess(UPDATED_WHEELCHAIR_ACCESS)
            .parking(UPDATED_PARKING)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restEmergencyStationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyStations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyStations))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
        EmergencyStations testEmergencyStations = emergencyStationsList.get(emergencyStationsList.size() - 1);
        assertThat(testEmergencyStations.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyStations.getStationType()).isEqualTo(UPDATED_STATION_TYPE);
        assertThat(testEmergencyStations.getWheelchairAccess()).isEqualTo(UPDATED_WHEELCHAIR_ACCESS);
        assertThat(testEmergencyStations.getParking()).isEqualTo(UPDATED_PARKING);
        assertThat(testEmergencyStations.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testEmergencyStations.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void patchNonExistingEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emergencyStations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmergencyStations() throws Exception {
        int databaseSizeBeforeUpdate = emergencyStationsRepository.findAll().size();
        emergencyStations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyStationsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyStations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyStations in the database
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmergencyStations() throws Exception {
        // Initialize the database
        emergencyStationsRepository.saveAndFlush(emergencyStations);

        int databaseSizeBeforeDelete = emergencyStationsRepository.findAll().size();

        // Delete the emergencyStations
        restEmergencyStationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, emergencyStations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmergencyStations> emergencyStationsList = emergencyStationsRepository.findAll();
        assertThat(emergencyStationsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
