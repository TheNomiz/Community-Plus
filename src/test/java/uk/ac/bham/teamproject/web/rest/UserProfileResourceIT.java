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
import uk.ac.bham.teamproject.domain.UserProfile;
import uk.ac.bham.teamproject.repository.UserProfileRepository;

/**
 * Integration tests for the {@link UserProfileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserProfileResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_FIRSTNAMES = "AAAAAAAAAA";
    private static final String UPDATED_FIRSTNAMES = "BBBBBBBBBB";

    private static final String DEFAULT_LASTNAME = "AAAAAAAAAA";
    private static final String UPDATED_LASTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_LANGUAGE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_VERIFIED = false;
    private static final Boolean UPDATED_VERIFIED = true;

    private static final Boolean DEFAULT_PRIVATE_ACCOUNT = false;
    private static final Boolean UPDATED_PRIVATE_ACCOUNT = true;

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final String DEFAULT_ACCOUNT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_OCCUPATION = "AAAAAAAAAA";
    private static final String UPDATED_OCCUPATION = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_POSTAL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POSTAL_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_BIO = "AAAAAAAAAA";
    private static final String UPDATED_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBBB";

    private static final Integer DEFAULT_COMMUNITY_POINTS = 1;
    private static final Integer UPDATED_COMMUNITY_POINTS = 2;

    private static final Boolean DEFAULT_G_PS = false;
    private static final Boolean UPDATED_G_PS = true;

    private static final Boolean DEFAULT_DARKMODE = false;
    private static final Boolean UPDATED_DARKMODE = true;

    private static final Integer DEFAULT_FONTSIZE = 1;
    private static final Integer UPDATED_FONTSIZE = 2;

    private static final String ENTITY_API_URL = "/api/user-profiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserProfileMockMvc;

    private UserProfile userProfile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserProfile createEntity(EntityManager em) {
        UserProfile userProfile = new UserProfile()
            .username(DEFAULT_USERNAME)
            .firstnames(DEFAULT_FIRSTNAMES)
            .lastname(DEFAULT_LASTNAME)
            .password(DEFAULT_PASSWORD)
            .email(DEFAULT_EMAIL)
            .language(DEFAULT_LANGUAGE)
            .verified(DEFAULT_VERIFIED)
            .privateAccount(DEFAULT_PRIVATE_ACCOUNT)
            .age(DEFAULT_AGE)
            .accountType(DEFAULT_ACCOUNT_TYPE)
            .occupation(DEFAULT_OCCUPATION)
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .city(DEFAULT_CITY)
            .postalCode(DEFAULT_POSTAL_CODE)
            .bio(DEFAULT_BIO)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .communityPoints(DEFAULT_COMMUNITY_POINTS)
            .gPS(DEFAULT_G_PS)
            .darkmode(DEFAULT_DARKMODE)
            .fontsize(DEFAULT_FONTSIZE);
        return userProfile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserProfile createUpdatedEntity(EntityManager em) {
        UserProfile userProfile = new UserProfile()
            .username(UPDATED_USERNAME)
            .firstnames(UPDATED_FIRSTNAMES)
            .lastname(UPDATED_LASTNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .verified(UPDATED_VERIFIED)
            .privateAccount(UPDATED_PRIVATE_ACCOUNT)
            .age(UPDATED_AGE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .occupation(UPDATED_OCCUPATION)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .postalCode(UPDATED_POSTAL_CODE)
            .bio(UPDATED_BIO)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .communityPoints(UPDATED_COMMUNITY_POINTS)
            .gPS(UPDATED_G_PS)
            .darkmode(UPDATED_DARKMODE)
            .fontsize(UPDATED_FONTSIZE);
        return userProfile;
    }

    @BeforeEach
    public void initTest() {
        userProfile = createEntity(em);
    }

    @Test
    @Transactional
    void createUserProfile() throws Exception {
        int databaseSizeBeforeCreate = userProfileRepository.findAll().size();
        // Create the UserProfile
        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isCreated());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeCreate + 1);
        UserProfile testUserProfile = userProfileList.get(userProfileList.size() - 1);
        assertThat(testUserProfile.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testUserProfile.getFirstnames()).isEqualTo(DEFAULT_FIRSTNAMES);
        assertThat(testUserProfile.getLastname()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(testUserProfile.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testUserProfile.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUserProfile.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testUserProfile.getVerified()).isEqualTo(DEFAULT_VERIFIED);
        assertThat(testUserProfile.getPrivateAccount()).isEqualTo(DEFAULT_PRIVATE_ACCOUNT);
        assertThat(testUserProfile.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testUserProfile.getAccountType()).isEqualTo(DEFAULT_ACCOUNT_TYPE);
        assertThat(testUserProfile.getOccupation()).isEqualTo(DEFAULT_OCCUPATION);
        assertThat(testUserProfile.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testUserProfile.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testUserProfile.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testUserProfile.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testUserProfile.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testUserProfile.getCommunityPoints()).isEqualTo(DEFAULT_COMMUNITY_POINTS);
        assertThat(testUserProfile.getgPS()).isEqualTo(DEFAULT_G_PS);
        assertThat(testUserProfile.getDarkmode()).isEqualTo(DEFAULT_DARKMODE);
        assertThat(testUserProfile.getFontsize()).isEqualTo(DEFAULT_FONTSIZE);
    }

    @Test
    @Transactional
    void createUserProfileWithExistingId() throws Exception {
        // Create the UserProfile with an existing ID
        userProfile.setId(1L);

        int databaseSizeBeforeCreate = userProfileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUsernameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setUsername(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFirstnamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setFirstnames(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setLastname(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasswordIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setPassword(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setEmail(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setLanguage(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVerifiedIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setVerified(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrivateAccountIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setPrivateAccount(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAgeIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setAge(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAccountTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setAccountType(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOccupationIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setOccupation(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPostalCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setPostalCode(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setPhoneNumber(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkgPSIsRequired() throws Exception {
        int databaseSizeBeforeTest = userProfileRepository.findAll().size();
        // set the field null
        userProfile.setgPS(null);

        // Create the UserProfile, which fails.

        restUserProfileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isBadRequest());

        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserProfiles() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        // Get all the userProfileList
        restUserProfileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userProfile.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].firstnames").value(hasItem(DEFAULT_FIRSTNAMES)))
            .andExpect(jsonPath("$.[*].lastname").value(hasItem(DEFAULT_LASTNAME)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE)))
            .andExpect(jsonPath("$.[*].verified").value(hasItem(DEFAULT_VERIFIED.booleanValue())))
            .andExpect(jsonPath("$.[*].privateAccount").value(hasItem(DEFAULT_PRIVATE_ACCOUNT.booleanValue())))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].accountType").value(hasItem(DEFAULT_ACCOUNT_TYPE)))
            .andExpect(jsonPath("$.[*].occupation").value(hasItem(DEFAULT_OCCUPATION)))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].postalCode").value(hasItem(DEFAULT_POSTAL_CODE)))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].communityPoints").value(hasItem(DEFAULT_COMMUNITY_POINTS)))
            .andExpect(jsonPath("$.[*].gPS").value(hasItem(DEFAULT_G_PS.booleanValue())))
            .andExpect(jsonPath("$.[*].darkmode").value(hasItem(DEFAULT_DARKMODE.booleanValue())))
            .andExpect(jsonPath("$.[*].fontsize").value(hasItem(DEFAULT_FONTSIZE)));
    }

    @Test
    @Transactional
    void getUserProfile() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        // Get the userProfile
        restUserProfileMockMvc
            .perform(get(ENTITY_API_URL_ID, userProfile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userProfile.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.firstnames").value(DEFAULT_FIRSTNAMES))
            .andExpect(jsonPath("$.lastname").value(DEFAULT_LASTNAME))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE))
            .andExpect(jsonPath("$.verified").value(DEFAULT_VERIFIED.booleanValue()))
            .andExpect(jsonPath("$.privateAccount").value(DEFAULT_PRIVATE_ACCOUNT.booleanValue()))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.accountType").value(DEFAULT_ACCOUNT_TYPE))
            .andExpect(jsonPath("$.occupation").value(DEFAULT_OCCUPATION))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.postalCode").value(DEFAULT_POSTAL_CODE))
            .andExpect(jsonPath("$.bio").value(DEFAULT_BIO))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.communityPoints").value(DEFAULT_COMMUNITY_POINTS))
            .andExpect(jsonPath("$.gPS").value(DEFAULT_G_PS.booleanValue()))
            .andExpect(jsonPath("$.darkmode").value(DEFAULT_DARKMODE.booleanValue()))
            .andExpect(jsonPath("$.fontsize").value(DEFAULT_FONTSIZE));
    }

    @Test
    @Transactional
    void getNonExistingUserProfile() throws Exception {
        // Get the userProfile
        restUserProfileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserProfile() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();

        // Update the userProfile
        UserProfile updatedUserProfile = userProfileRepository.findById(userProfile.getId()).get();
        // Disconnect from session so that the updates on updatedUserProfile are not directly saved in db
        em.detach(updatedUserProfile);
        updatedUserProfile
            .username(UPDATED_USERNAME)
            .firstnames(UPDATED_FIRSTNAMES)
            .lastname(UPDATED_LASTNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .verified(UPDATED_VERIFIED)
            .privateAccount(UPDATED_PRIVATE_ACCOUNT)
            .age(UPDATED_AGE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .occupation(UPDATED_OCCUPATION)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .postalCode(UPDATED_POSTAL_CODE)
            .bio(UPDATED_BIO)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .communityPoints(UPDATED_COMMUNITY_POINTS)
            .gPS(UPDATED_G_PS)
            .darkmode(UPDATED_DARKMODE)
            .fontsize(UPDATED_FONTSIZE);

        restUserProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserProfile))
            )
            .andExpect(status().isOk());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
        UserProfile testUserProfile = userProfileList.get(userProfileList.size() - 1);
        assertThat(testUserProfile.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testUserProfile.getFirstnames()).isEqualTo(UPDATED_FIRSTNAMES);
        assertThat(testUserProfile.getLastname()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUserProfile.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testUserProfile.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserProfile.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testUserProfile.getVerified()).isEqualTo(UPDATED_VERIFIED);
        assertThat(testUserProfile.getPrivateAccount()).isEqualTo(UPDATED_PRIVATE_ACCOUNT);
        assertThat(testUserProfile.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserProfile.getAccountType()).isEqualTo(UPDATED_ACCOUNT_TYPE);
        assertThat(testUserProfile.getOccupation()).isEqualTo(UPDATED_OCCUPATION);
        assertThat(testUserProfile.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testUserProfile.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testUserProfile.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testUserProfile.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testUserProfile.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserProfile.getCommunityPoints()).isEqualTo(UPDATED_COMMUNITY_POINTS);
        assertThat(testUserProfile.getgPS()).isEqualTo(UPDATED_G_PS);
        assertThat(testUserProfile.getDarkmode()).isEqualTo(UPDATED_DARKMODE);
        assertThat(testUserProfile.getFontsize()).isEqualTo(UPDATED_FONTSIZE);
    }

    @Test
    @Transactional
    void putNonExistingUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userProfile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userProfile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserProfileWithPatch() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();

        // Update the userProfile using partial update
        UserProfile partialUpdatedUserProfile = new UserProfile();
        partialUpdatedUserProfile.setId(userProfile.getId());

        partialUpdatedUserProfile
            .firstnames(UPDATED_FIRSTNAMES)
            .lastname(UPDATED_LASTNAME)
            .email(UPDATED_EMAIL)
            .privateAccount(UPDATED_PRIVATE_ACCOUNT)
            .age(UPDATED_AGE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .darkmode(UPDATED_DARKMODE);

        restUserProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserProfile))
            )
            .andExpect(status().isOk());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
        UserProfile testUserProfile = userProfileList.get(userProfileList.size() - 1);
        assertThat(testUserProfile.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testUserProfile.getFirstnames()).isEqualTo(UPDATED_FIRSTNAMES);
        assertThat(testUserProfile.getLastname()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUserProfile.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testUserProfile.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserProfile.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testUserProfile.getVerified()).isEqualTo(DEFAULT_VERIFIED);
        assertThat(testUserProfile.getPrivateAccount()).isEqualTo(UPDATED_PRIVATE_ACCOUNT);
        assertThat(testUserProfile.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserProfile.getAccountType()).isEqualTo(UPDATED_ACCOUNT_TYPE);
        assertThat(testUserProfile.getOccupation()).isEqualTo(DEFAULT_OCCUPATION);
        assertThat(testUserProfile.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testUserProfile.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testUserProfile.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testUserProfile.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testUserProfile.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserProfile.getCommunityPoints()).isEqualTo(DEFAULT_COMMUNITY_POINTS);
        assertThat(testUserProfile.getgPS()).isEqualTo(DEFAULT_G_PS);
        assertThat(testUserProfile.getDarkmode()).isEqualTo(UPDATED_DARKMODE);
        assertThat(testUserProfile.getFontsize()).isEqualTo(DEFAULT_FONTSIZE);
    }

    @Test
    @Transactional
    void fullUpdateUserProfileWithPatch() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();

        // Update the userProfile using partial update
        UserProfile partialUpdatedUserProfile = new UserProfile();
        partialUpdatedUserProfile.setId(userProfile.getId());

        partialUpdatedUserProfile
            .username(UPDATED_USERNAME)
            .firstnames(UPDATED_FIRSTNAMES)
            .lastname(UPDATED_LASTNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .verified(UPDATED_VERIFIED)
            .privateAccount(UPDATED_PRIVATE_ACCOUNT)
            .age(UPDATED_AGE)
            .accountType(UPDATED_ACCOUNT_TYPE)
            .occupation(UPDATED_OCCUPATION)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .postalCode(UPDATED_POSTAL_CODE)
            .bio(UPDATED_BIO)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .communityPoints(UPDATED_COMMUNITY_POINTS)
            .gPS(UPDATED_G_PS)
            .darkmode(UPDATED_DARKMODE)
            .fontsize(UPDATED_FONTSIZE);

        restUserProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserProfile))
            )
            .andExpect(status().isOk());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
        UserProfile testUserProfile = userProfileList.get(userProfileList.size() - 1);
        assertThat(testUserProfile.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testUserProfile.getFirstnames()).isEqualTo(UPDATED_FIRSTNAMES);
        assertThat(testUserProfile.getLastname()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUserProfile.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testUserProfile.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserProfile.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testUserProfile.getVerified()).isEqualTo(UPDATED_VERIFIED);
        assertThat(testUserProfile.getPrivateAccount()).isEqualTo(UPDATED_PRIVATE_ACCOUNT);
        assertThat(testUserProfile.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserProfile.getAccountType()).isEqualTo(UPDATED_ACCOUNT_TYPE);
        assertThat(testUserProfile.getOccupation()).isEqualTo(UPDATED_OCCUPATION);
        assertThat(testUserProfile.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testUserProfile.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testUserProfile.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testUserProfile.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testUserProfile.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserProfile.getCommunityPoints()).isEqualTo(UPDATED_COMMUNITY_POINTS);
        assertThat(testUserProfile.getgPS()).isEqualTo(UPDATED_G_PS);
        assertThat(testUserProfile.getDarkmode()).isEqualTo(UPDATED_DARKMODE);
        assertThat(testUserProfile.getFontsize()).isEqualTo(UPDATED_FONTSIZE);
    }

    @Test
    @Transactional
    void patchNonExistingUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userProfile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userProfile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserProfile() throws Exception {
        int databaseSizeBeforeUpdate = userProfileRepository.findAll().size();
        userProfile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserProfileMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userProfile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserProfile in the database
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserProfile() throws Exception {
        // Initialize the database
        userProfileRepository.saveAndFlush(userProfile);

        int databaseSizeBeforeDelete = userProfileRepository.findAll().size();

        // Delete the userProfile
        restUserProfileMockMvc
            .perform(delete(ENTITY_API_URL_ID, userProfile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserProfile> userProfileList = userProfileRepository.findAll();
        assertThat(userProfileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
