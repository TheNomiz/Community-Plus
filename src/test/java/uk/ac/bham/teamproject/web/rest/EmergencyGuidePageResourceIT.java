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
import uk.ac.bham.teamproject.domain.EmergencyGuidePage;
import uk.ac.bham.teamproject.repository.EmergencyGuidePageRepository;

/**
 * Integration tests for the {@link EmergencyGuidePageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmergencyGuidePageResourceIT {

    private static final String DEFAULT_EMERGENCY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_EMERGENCY_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/emergency-guide-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmergencyGuidePageRepository emergencyGuidePageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmergencyGuidePageMockMvc;

    private EmergencyGuidePage emergencyGuidePage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyGuidePage createEntity(EntityManager em) {
        EmergencyGuidePage emergencyGuidePage = new EmergencyGuidePage().emergencyType(DEFAULT_EMERGENCY_TYPE);
        return emergencyGuidePage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyGuidePage createUpdatedEntity(EntityManager em) {
        EmergencyGuidePage emergencyGuidePage = new EmergencyGuidePage().emergencyType(UPDATED_EMERGENCY_TYPE);
        return emergencyGuidePage;
    }

    @BeforeEach
    public void initTest() {
        emergencyGuidePage = createEntity(em);
    }

    @Test
    @Transactional
    void createEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeCreate = emergencyGuidePageRepository.findAll().size();
        // Create the EmergencyGuidePage
        restEmergencyGuidePageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isCreated());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeCreate + 1);
        EmergencyGuidePage testEmergencyGuidePage = emergencyGuidePageList.get(emergencyGuidePageList.size() - 1);
        assertThat(testEmergencyGuidePage.getEmergencyType()).isEqualTo(DEFAULT_EMERGENCY_TYPE);
    }

    @Test
    @Transactional
    void createEmergencyGuidePageWithExistingId() throws Exception {
        // Create the EmergencyGuidePage with an existing ID
        emergencyGuidePage.setId(1L);

        int databaseSizeBeforeCreate = emergencyGuidePageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmergencyGuidePageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEmergencyTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = emergencyGuidePageRepository.findAll().size();
        // set the field null
        emergencyGuidePage.setEmergencyType(null);

        // Create the EmergencyGuidePage, which fails.

        restEmergencyGuidePageMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmergencyGuidePages() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        // Get all the emergencyGuidePageList
        restEmergencyGuidePageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emergencyGuidePage.getId().intValue())))
            .andExpect(jsonPath("$.[*].emergencyType").value(hasItem(DEFAULT_EMERGENCY_TYPE)));
    }

    @Test
    @Transactional
    void getEmergencyGuidePage() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        // Get the emergencyGuidePage
        restEmergencyGuidePageMockMvc
            .perform(get(ENTITY_API_URL_ID, emergencyGuidePage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emergencyGuidePage.getId().intValue()))
            .andExpect(jsonPath("$.emergencyType").value(DEFAULT_EMERGENCY_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingEmergencyGuidePage() throws Exception {
        // Get the emergencyGuidePage
        restEmergencyGuidePageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmergencyGuidePage() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();

        // Update the emergencyGuidePage
        EmergencyGuidePage updatedEmergencyGuidePage = emergencyGuidePageRepository.findById(emergencyGuidePage.getId()).get();
        // Disconnect from session so that the updates on updatedEmergencyGuidePage are not directly saved in db
        em.detach(updatedEmergencyGuidePage);
        updatedEmergencyGuidePage.emergencyType(UPDATED_EMERGENCY_TYPE);

        restEmergencyGuidePageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmergencyGuidePage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmergencyGuidePage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuidePage testEmergencyGuidePage = emergencyGuidePageList.get(emergencyGuidePageList.size() - 1);
        assertThat(testEmergencyGuidePage.getEmergencyType()).isEqualTo(UPDATED_EMERGENCY_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emergencyGuidePage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmergencyGuidePageWithPatch() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();

        // Update the emergencyGuidePage using partial update
        EmergencyGuidePage partialUpdatedEmergencyGuidePage = new EmergencyGuidePage();
        partialUpdatedEmergencyGuidePage.setId(emergencyGuidePage.getId());

        restEmergencyGuidePageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyGuidePage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyGuidePage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuidePage testEmergencyGuidePage = emergencyGuidePageList.get(emergencyGuidePageList.size() - 1);
        assertThat(testEmergencyGuidePage.getEmergencyType()).isEqualTo(DEFAULT_EMERGENCY_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateEmergencyGuidePageWithPatch() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();

        // Update the emergencyGuidePage using partial update
        EmergencyGuidePage partialUpdatedEmergencyGuidePage = new EmergencyGuidePage();
        partialUpdatedEmergencyGuidePage.setId(emergencyGuidePage.getId());

        partialUpdatedEmergencyGuidePage.emergencyType(UPDATED_EMERGENCY_TYPE);

        restEmergencyGuidePageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyGuidePage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyGuidePage))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
        EmergencyGuidePage testEmergencyGuidePage = emergencyGuidePageList.get(emergencyGuidePageList.size() - 1);
        assertThat(testEmergencyGuidePage.getEmergencyType()).isEqualTo(UPDATED_EMERGENCY_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emergencyGuidePage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmergencyGuidePage() throws Exception {
        int databaseSizeBeforeUpdate = emergencyGuidePageRepository.findAll().size();
        emergencyGuidePage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyGuidePageMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyGuidePage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyGuidePage in the database
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmergencyGuidePage() throws Exception {
        // Initialize the database
        emergencyGuidePageRepository.saveAndFlush(emergencyGuidePage);

        int databaseSizeBeforeDelete = emergencyGuidePageRepository.findAll().size();

        // Delete the emergencyGuidePage
        restEmergencyGuidePageMockMvc
            .perform(delete(ENTITY_API_URL_ID, emergencyGuidePage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmergencyGuidePage> emergencyGuidePageList = emergencyGuidePageRepository.findAll();
        assertThat(emergencyGuidePageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
