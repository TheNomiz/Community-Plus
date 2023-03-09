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
import uk.ac.bham.teamproject.domain.LostFoundPage;
import uk.ac.bham.teamproject.repository.LostFoundPageRepository;

/**
 * Integration tests for the {@link LostFoundPageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LostFoundPageResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lost-found-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LostFoundPageRepository lostFoundPageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLostFoundPageMockMvc;

    private LostFoundPage lostFoundPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LostFoundPage createEntity(EntityManager em) {
        LostFoundPage lostFoundPage = new LostFoundPage().description(DEFAULT_DESCRIPTION);
        return lostFoundPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LostFoundPage createUpdatedEntity(EntityManager em) {
        LostFoundPage lostFoundPage = new LostFoundPage().description(UPDATED_DESCRIPTION);
        return lostFoundPage;
    }

    @BeforeEach
    public void initTest() {
        lostFoundPage = createEntity(em);
    }

    @Test
    @Transactional
    void createLostFoundPage() throws Exception {
        int databaseSizeBeforeCreate = lostFoundPageRepository.findAll().size();
        // Create the LostFoundPage
        restLostFoundPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFoundPage)))
            .andExpect(status().isCreated());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeCreate + 1);
        LostFoundPage testLostFoundPage = lostFoundPageList.get(lostFoundPageList.size() - 1);
        assertThat(testLostFoundPage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createLostFoundPageWithExistingId() throws Exception {
        // Create the LostFoundPage with an existing ID
        lostFoundPage.setId(1L);

        int databaseSizeBeforeCreate = lostFoundPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLostFoundPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFoundPage)))
            .andExpect(status().isBadRequest());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = lostFoundPageRepository.findAll().size();
        // set the field null
        lostFoundPage.setDescription(null);

        // Create the LostFoundPage, which fails.

        restLostFoundPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFoundPage)))
            .andExpect(status().isBadRequest());

        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLostFoundPages() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        // Get all the lostFoundPageList
        restLostFoundPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lostFoundPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getLostFoundPage() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        // Get the lostFoundPage
        restLostFoundPageMockMvc
            .perform(get(ENTITY_API_URL_ID, lostFoundPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lostFoundPage.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingLostFoundPage() throws Exception {
        // Get the lostFoundPage
        restLostFoundPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLostFoundPage() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();

        // Update the lostFoundPage
        LostFoundPage updatedLostFoundPage = lostFoundPageRepository.findById(lostFoundPage.getId()).get();
        // Disconnect from session so that the updates on updatedLostFoundPage are not directly saved in db
        em.detach(updatedLostFoundPage);
        updatedLostFoundPage.description(UPDATED_DESCRIPTION);

        restLostFoundPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLostFoundPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLostFoundPage))
            )
            .andExpect(status().isOk());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
        LostFoundPage testLostFoundPage = lostFoundPageList.get(lostFoundPageList.size() - 1);
        assertThat(testLostFoundPage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lostFoundPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lostFoundPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lostFoundPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lostFoundPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLostFoundPageWithPatch() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();

        // Update the lostFoundPage using partial update
        LostFoundPage partialUpdatedLostFoundPage = new LostFoundPage();
        partialUpdatedLostFoundPage.setId(lostFoundPage.getId());

        restLostFoundPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLostFoundPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLostFoundPage))
            )
            .andExpect(status().isOk());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
        LostFoundPage testLostFoundPage = lostFoundPageList.get(lostFoundPageList.size() - 1);
        assertThat(testLostFoundPage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateLostFoundPageWithPatch() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();

        // Update the lostFoundPage using partial update
        LostFoundPage partialUpdatedLostFoundPage = new LostFoundPage();
        partialUpdatedLostFoundPage.setId(lostFoundPage.getId());

        partialUpdatedLostFoundPage.description(UPDATED_DESCRIPTION);

        restLostFoundPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLostFoundPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLostFoundPage))
            )
            .andExpect(status().isOk());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
        LostFoundPage testLostFoundPage = lostFoundPageList.get(lostFoundPageList.size() - 1);
        assertThat(testLostFoundPage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lostFoundPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lostFoundPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lostFoundPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLostFoundPage() throws Exception {
        int databaseSizeBeforeUpdate = lostFoundPageRepository.findAll().size();
        lostFoundPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLostFoundPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lostFoundPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LostFoundPage in the database
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLostFoundPage() throws Exception {
        // Initialize the database
        lostFoundPageRepository.saveAndFlush(lostFoundPage);

        int databaseSizeBeforeDelete = lostFoundPageRepository.findAll().size();

        // Delete the lostFoundPage
        restLostFoundPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, lostFoundPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LostFoundPage> lostFoundPageList = lostFoundPageRepository.findAll();
        assertThat(lostFoundPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
