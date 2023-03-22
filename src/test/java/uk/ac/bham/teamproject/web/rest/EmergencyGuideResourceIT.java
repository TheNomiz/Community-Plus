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
import uk.ac.bham.teamproject.domain.EmergencyGuide;
import uk.ac.bham.teamproject.repository.EmergencyGuideRepository;

/**
 * Integration tests for the {@link EmergencyGuideResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmergencyGuideResourceIT {

    private static final String DEFAULT_EMERGENCY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_EMERGENCY_TYPE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_PANIC_BUTTON = false;
    private static final Boolean UPDATED_PANIC_BUTTON = true;

    private static final String ENTITY_API_URL = "/api/emergency-guides";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmergencyGuideRepository emergencyGuideRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmergencyGuideMockMvc;

    private EmergencyGuide emergencyGuide;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyGuide createEntity(EntityManager em) {
        EmergencyGuide emergencyGuide = new EmergencyGuide().emergencyType(DEFAULT_EMERGENCY_TYPE).panicButton(DEFAULT_PANIC_BUTTON);
        return emergencyGuide;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyGuide createUpdatedEntity(EntityManager em) {
        EmergencyGuide emergencyGuide = new EmergencyGuide().emergencyType(UPDATED_EMERGENCY_TYPE).panicButton(UPDATED_PANIC_BUTTON);
        return emergencyGuide;
    }

    @BeforeEach
    public void initTest() {
        emergencyGuide = createEntity(em);
    }

    @Test
    @Transactional
    void createEmergencyGuide() throws Exception {
        int databaseSizeBeforeCreate = emergencyGuideRepository.findAll().size();
        // Create the EmergencyGuide
        restEmergencyGuideMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isCreated());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeCreate + 1);
        EmergencyGuide testEmergencyGuide = emergencyGuideList.get(emergencyGuideList.size() - 1);
        assertThat(testEmergencyGuide.getEmergencyType()).isEqualTo(DEFAULT_EMERGENCY_TYPE);
        assertThat(testEmergencyGuide.getPanicButton()).isEqualTo(DEFAULT_PANIC_BUTTON);
    }

    @Test
    @Transactional
    void createEmergencyGuideWithExistingId() throws Exception {
        // Create the EmergencyGuide with an existing ID
        emergencyGuide.setId(1L);

        int databaseSizeBeforeCreate = emergencyGuideRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmergencyGuideMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEmergencyTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyGuideRepository.findAll().size();
        // set the field null
        emergencyGuide.setEmergencyType(null);

        // Create the EmergencyGuide, which fails.

        restEmergencyGuideMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPanicButtonIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyGuideRepository.findAll().size();
        // set the field null
        emergencyGuide.setPanicButton(null);

        // Create the EmergencyGuide, which fails.

        restEmergencyGuideMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmergencyGuides() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        // Get all the emergencyGuideList
        restEmergencyGuideMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emergencyGuide.getId().intValue())))
            .andExpect(jsonPath("$.[*].emergencyType").value(hasItem(DEFAULT_EMERGENCY_TYPE)))
            .andExpect(jsonPath("$.[*].panicButton").value(hasItem(DEFAULT_PANIC_BUTTON.booleanValue())));
    }

    @Test
    @Transactional
    void getEmergencyGuide() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        // Get the emergencyGuide
        restEmergencyGuideMockMvc
            .perform(get(ENTITY_API_URL_ID, emergencyGuide.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emergencyGuide.getId().intValue()))
            .andExpect(jsonPath("$.emergencyType").value(DEFAULT_EMERGENCY_TYPE))
            .andExpect(jsonPath("$.panicButton").value(DEFAULT_PANIC_BUTTON.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingEmergencyGuide() throws Exception {
        // Get the emergencyGuide
        restEmergencyGuideMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmergencyGuide() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();

        // Update the emergencyGuide
        EmergencyGuide updatedEmergencyGuide = emergencyGuideRepository.findById(emergencyGuide.getId()).get();
        // Disconnect from session so that the updates on updatedEmergencyGuide are not directly saved in db
        em.detach(updatedEmergencyGuide);
        updatedEmergencyGuide.emergencyType(UPDATED_EMERGENCY_TYPE).panicButton(UPDATED_PANIC_BUTTON);

        restEmergencyGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmergencyGuide.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmergencyGuide))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuide testEmergencyGuide = emergencyGuideList.get(emergencyGuideList.size() - 1);
        assertThat(testEmergencyGuide.getEmergencyType()).isEqualTo(UPDATED_EMERGENCY_TYPE);
        assertThat(testEmergencyGuide.getPanicButton()).isEqualTo(UPDATED_PANIC_BUTTON);
    }

    @Test
    @Transactional
    void putNonExistingEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emergencyGuide.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuide)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmergencyGuideWithPatch() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();

        // Update the emergencyGuide using partial update
        EmergencyGuide partialUpdatedEmergencyGuide = new EmergencyGuide();
        partialUpdatedEmergencyGuide.setId(emergencyGuide.getId());

        partialUpdatedEmergencyGuide.panicButton(UPDATED_PANIC_BUTTON);

        restEmergencyGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyGuide))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuide testEmergencyGuide = emergencyGuideList.get(emergencyGuideList.size() - 1);
        assertThat(testEmergencyGuide.getEmergencyType()).isEqualTo(DEFAULT_EMERGENCY_TYPE);
        assertThat(testEmergencyGuide.getPanicButton()).isEqualTo(UPDATED_PANIC_BUTTON);
    }

    @Test
    @Transactional
    void fullUpdateEmergencyGuideWithPatch() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();

        // Update the emergencyGuide using partial update
        EmergencyGuide partialUpdatedEmergencyGuide = new EmergencyGuide();
        partialUpdatedEmergencyGuide.setId(emergencyGuide.getId());

        partialUpdatedEmergencyGuide.emergencyType(UPDATED_EMERGENCY_TYPE).panicButton(UPDATED_PANIC_BUTTON);

        restEmergencyGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyGuide))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuide testEmergencyGuide = emergencyGuideList.get(emergencyGuideList.size() - 1);
        assertThat(testEmergencyGuide.getEmergencyType()).isEqualTo(UPDATED_EMERGENCY_TYPE);
        assertThat(testEmergencyGuide.getPanicButton()).isEqualTo(UPDATED_PANIC_BUTTON);
    }

    @Test
    @Transactional
    void patchNonExistingEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emergencyGuide.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmergencyGuide() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuideRepository.findAll().size();
        emergencyGuide.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuideMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(emergencyGuide))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyGuide in the database
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmergencyGuide() throws Exception {
        // Initialize the database
        emergencyGuideRepository.saveAndFlush(emergencyGuide);

        int databaseSizeBeforeDelete = emergencyGuideRepository.findAll().size();

        // Delete the emergencyGuide
        restEmergencyGuideMockMvc
            .perform(delete(ENTITY_API_URL_ID, emergencyGuide.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmergencyGuide> emergencyGuideList = emergencyGuideRepository.findAll();
        assertThat(emergencyGuideList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
