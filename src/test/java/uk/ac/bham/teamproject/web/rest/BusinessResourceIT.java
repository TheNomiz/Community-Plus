package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.ac.bham.teamproject.domain.Business;
import uk.ac.bham.teamproject.repository.BusinessRepository;

/**
 * Integration tests for the {@link BusinessResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BusinessResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final Integer DEFAULT_PHONE_NUMBER = 1;
    private static final Integer UPDATED_PHONE_NUMBER = 2;

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_WEBSITE_URL = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE_URL = "BBBBBBBBBB";

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final String ENTITY_API_URL = "/api/businesses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessRepository businessRepository;

    @Mock
    private BusinessRepository businessRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessMockMvc;

    private Business business;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Business createEntity(EntityManager em) {
        Business business = new Business()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .category(DEFAULT_CATEGORY)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .email(DEFAULT_EMAIL)
            .websiteUrl(DEFAULT_WEBSITE_URL)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE);
        return business;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Business createUpdatedEntity(EntityManager em) {
        Business business = new Business()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .websiteUrl(UPDATED_WEBSITE_URL)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);
        return business;
    }

    @BeforeEach
    public void initTest() {
        business = createEntity(em);
    }

    @Test
    @Transactional
    void createBusiness() throws Exception {
        int databaseSizeBeforeCreate = businessRepository.findAll().size();
        // Create the Business
        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isCreated());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeCreate + 1);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusiness.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBusiness.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testBusiness.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testBusiness.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBusiness.getWebsiteUrl()).isEqualTo(DEFAULT_WEBSITE_URL);
        assertThat(testBusiness.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testBusiness.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
    }

    @Test
    @Transactional
    void createBusinessWithExistingId() throws Exception {
        // Create the Business with an existing ID
        business.setId(1L);

        int databaseSizeBeforeCreate = businessRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setName(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setDescription(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setCategory(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setPhoneNumber(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setLatitude(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRepository.findAll().size();
        // set the field null
        business.setLongitude(null);

        // Create the Business, which fails.

        restBusinessMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isBadRequest());

        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBusinesses() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        // Get all the businessList
        restBusinessMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(business.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].websiteUrl").value(hasItem(DEFAULT_WEBSITE_URL)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBusinessesWithEagerRelationshipsIsEnabled() throws Exception {
        when(businessRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBusinessMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(businessRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBusinessesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(businessRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBusinessMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(businessRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        // Get the business
        restBusinessMockMvc
            .perform(get(ENTITY_API_URL_ID, business.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(business.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.websiteUrl").value(DEFAULT_WEBSITE_URL))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingBusiness() throws Exception {
        // Get the business
        restBusinessMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business
        Business updatedBusiness = businessRepository.findById(business.getId()).get();
        // Disconnect from session so that the updates on updatedBusiness are not directly saved in db
        em.detach(updatedBusiness);
        updatedBusiness
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .websiteUrl(UPDATED_WEBSITE_URL)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusiness.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusiness.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBusiness.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testBusiness.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testBusiness.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBusiness.getWebsiteUrl()).isEqualTo(UPDATED_WEBSITE_URL);
        assertThat(testBusiness.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testBusiness.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void putNonExistingBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, business.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessWithPatch() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business using partial update
        Business partialUpdatedBusiness = new Business();
        partialUpdatedBusiness.setId(business.getId());

        partialUpdatedBusiness.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).email(UPDATED_EMAIL).longitude(UPDATED_LONGITUDE);

        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusiness.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusiness.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBusiness.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testBusiness.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testBusiness.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBusiness.getWebsiteUrl()).isEqualTo(DEFAULT_WEBSITE_URL);
        assertThat(testBusiness.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testBusiness.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void fullUpdateBusinessWithPatch() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeUpdate = businessRepository.findAll().size();

        // Update the business using partial update
        Business partialUpdatedBusiness = new Business();
        partialUpdatedBusiness.setId(business.getId());

        partialUpdatedBusiness
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .websiteUrl(UPDATED_WEBSITE_URL)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE);

        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusiness.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusiness))
            )
            .andExpect(status().isOk());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
        Business testBusiness = businessList.get(businessList.size() - 1);
        assertThat(testBusiness.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusiness.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBusiness.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testBusiness.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testBusiness.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBusiness.getWebsiteUrl()).isEqualTo(UPDATED_WEBSITE_URL);
        assertThat(testBusiness.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testBusiness.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
    }

    @Test
    @Transactional
    void patchNonExistingBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, business.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(business))
            )
            .andExpect(status().isBadRequest());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusiness() throws Exception {
        int databaseSizeBeforeUpdate = businessRepository.findAll().size();
        business.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(business)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Business in the database
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusiness() throws Exception {
        // Initialize the database
        businessRepository.saveAndFlush(business);

        int databaseSizeBeforeDelete = businessRepository.findAll().size();

        // Delete the business
        restBusinessMockMvc
            .perform(delete(ENTITY_API_URL_ID, business.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Business> businessList = businessRepository.findAll();
        assertThat(businessList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
