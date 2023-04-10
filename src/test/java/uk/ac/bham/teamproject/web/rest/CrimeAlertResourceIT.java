package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.ac.bham.teamproject.web.rest.TestUtil.sameNumber;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Comment;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.enumeration.CrimeTypes;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.service.CrimeAlertService;
import uk.ac.bham.teamproject.service.criteria.CrimeAlertCriteria;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.mapper.CrimeAlertMapper;

/**
 * Integration tests for the {@link CrimeAlertResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CrimeAlertResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBBBBBBBBBBBB";

    private static final BigDecimal DEFAULT_LAT = new BigDecimal(1);
    private static final BigDecimal UPDATED_LAT = new BigDecimal(2);
    private static final BigDecimal SMALLER_LAT = new BigDecimal(1 - 1);

    private static final BigDecimal DEFAULT_LON = new BigDecimal(1);
    private static final BigDecimal UPDATED_LON = new BigDecimal(2);
    private static final BigDecimal SMALLER_LON = new BigDecimal(1 - 1);

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_CRIME_ID = 1L;
    private static final Long UPDATED_CRIME_ID = 2L;
    private static final Long SMALLER_CRIME_ID = 1L - 1L;

    private static final CrimeTypes DEFAULT_CRIME_TYPE = CrimeTypes.ALLCRIME;
    private static final CrimeTypes UPDATED_CRIME_TYPE = CrimeTypes.ANTISOCIALBEHAVIOUR;

    private static final byte[] DEFAULT_CRIME_PHOTO_1 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CRIME_PHOTO_1 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CRIME_PHOTO_1_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CRIME_PHOTO_2 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CRIME_PHOTO_2 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CRIME_PHOTO_2_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CRIME_PHOTO_3 = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CRIME_PHOTO_3 = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CRIME_PHOTO_3_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/crime-alerts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CrimeAlertRepository crimeAlertRepository;

    @Mock
    private CrimeAlertRepository crimeAlertRepositoryMock;

    @Autowired
    private CrimeAlertMapper crimeAlertMapper;

    @Mock
    private CrimeAlertService crimeAlertServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCrimeAlertMockMvc;

    private CrimeAlert crimeAlert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CrimeAlert createEntity(EntityManager em) {
        CrimeAlert crimeAlert = new CrimeAlert()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .lat(DEFAULT_LAT)
            .lon(DEFAULT_LON)
            .date(DEFAULT_DATE)
            .crimeID(DEFAULT_CRIME_ID)
            .crimeType(DEFAULT_CRIME_TYPE)
            .crimePhoto1(DEFAULT_CRIME_PHOTO_1)
            .crimePhoto1ContentType(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE)
            .crimePhoto2(DEFAULT_CRIME_PHOTO_2)
            .crimePhoto2ContentType(DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE)
            .crimePhoto3(DEFAULT_CRIME_PHOTO_3)
            .crimePhoto3ContentType(DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        crimeAlert.setPostedby(user);
        return crimeAlert;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CrimeAlert createUpdatedEntity(EntityManager em) {
        CrimeAlert crimeAlert = new CrimeAlert()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .lat(UPDATED_LAT)
            .lon(UPDATED_LON)
            .date(UPDATED_DATE)
            .crimeID(UPDATED_CRIME_ID)
            .crimeType(UPDATED_CRIME_TYPE)
            .crimePhoto1(UPDATED_CRIME_PHOTO_1)
            .crimePhoto1ContentType(UPDATED_CRIME_PHOTO_1_CONTENT_TYPE)
            .crimePhoto2(UPDATED_CRIME_PHOTO_2)
            .crimePhoto2ContentType(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE)
            .crimePhoto3(UPDATED_CRIME_PHOTO_3)
            .crimePhoto3ContentType(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        crimeAlert.setPostedby(user);
        return crimeAlert;
    }

    @BeforeEach
    public void initTest() {
        crimeAlert = createEntity(em);
    }

    @Test
    @Transactional
    void createCrimeAlert() throws Exception {
        int databaseSizeBeforeCreate = crimeAlertRepository.findAll().size();
        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);
        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isCreated());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeCreate + 1);
        CrimeAlert testCrimeAlert = crimeAlertList.get(crimeAlertList.size() - 1);
        assertThat(testCrimeAlert.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testCrimeAlert.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCrimeAlert.getLat()).isEqualByComparingTo(DEFAULT_LAT);
        assertThat(testCrimeAlert.getLon()).isEqualByComparingTo(DEFAULT_LON);
        assertThat(testCrimeAlert.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testCrimeAlert.getCrimeID()).isEqualTo(DEFAULT_CRIME_ID);
        assertThat(testCrimeAlert.getCrimeType()).isEqualTo(DEFAULT_CRIME_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto1()).isEqualTo(DEFAULT_CRIME_PHOTO_1);
        assertThat(testCrimeAlert.getCrimePhoto1ContentType()).isEqualTo(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto2()).isEqualTo(DEFAULT_CRIME_PHOTO_2);
        assertThat(testCrimeAlert.getCrimePhoto2ContentType()).isEqualTo(DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto3()).isEqualTo(DEFAULT_CRIME_PHOTO_3);
        assertThat(testCrimeAlert.getCrimePhoto3ContentType()).isEqualTo(DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createCrimeAlertWithExistingId() throws Exception {
        // Create the CrimeAlert with an existing ID
        crimeAlert.setId(1L);
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        int databaseSizeBeforeCreate = crimeAlertRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setTitle(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setDescription(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLatIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setLat(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLonIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setLon(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setDate(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCrimeIDIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setCrimeID(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCrimeTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = crimeAlertRepository.findAll().size();
        // set the field null
        crimeAlert.setCrimeType(null);

        // Create the CrimeAlert, which fails.
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        restCrimeAlertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isBadRequest());

        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCrimeAlerts() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(crimeAlert.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].lat").value(hasItem(sameNumber(DEFAULT_LAT))))
            .andExpect(jsonPath("$.[*].lon").value(hasItem(sameNumber(DEFAULT_LON))))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].crimeID").value(hasItem(DEFAULT_CRIME_ID.intValue())))
            .andExpect(jsonPath("$.[*].crimeType").value(hasItem(DEFAULT_CRIME_TYPE.toString())))
            .andExpect(jsonPath("$.[*].crimePhoto1ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto1").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_1))))
            .andExpect(jsonPath("$.[*].crimePhoto2ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto2").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_2))))
            .andExpect(jsonPath("$.[*].crimePhoto3ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto3").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_3))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCrimeAlertsWithEagerRelationshipsIsEnabled() throws Exception {
        when(crimeAlertServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCrimeAlertMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(crimeAlertServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCrimeAlertsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(crimeAlertServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCrimeAlertMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(crimeAlertRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCrimeAlert() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get the crimeAlert
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL_ID, crimeAlert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(crimeAlert.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.lat").value(sameNumber(DEFAULT_LAT)))
            .andExpect(jsonPath("$.lon").value(sameNumber(DEFAULT_LON)))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.crimeID").value(DEFAULT_CRIME_ID.intValue()))
            .andExpect(jsonPath("$.crimeType").value(DEFAULT_CRIME_TYPE.toString()))
            .andExpect(jsonPath("$.crimePhoto1ContentType").value(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE))
            .andExpect(jsonPath("$.crimePhoto1").value(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_1)))
            .andExpect(jsonPath("$.crimePhoto2ContentType").value(DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE))
            .andExpect(jsonPath("$.crimePhoto2").value(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_2)))
            .andExpect(jsonPath("$.crimePhoto3ContentType").value(DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE))
            .andExpect(jsonPath("$.crimePhoto3").value(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_3)));
    }

    @Test
    @Transactional
    void getCrimeAlertsByIdFiltering() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        Long id = crimeAlert.getId();

        defaultCrimeAlertShouldBeFound("id.equals=" + id);
        defaultCrimeAlertShouldNotBeFound("id.notEquals=" + id);

        defaultCrimeAlertShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultCrimeAlertShouldNotBeFound("id.greaterThan=" + id);

        defaultCrimeAlertShouldBeFound("id.lessThanOrEqual=" + id);
        defaultCrimeAlertShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where title equals to DEFAULT_TITLE
        defaultCrimeAlertShouldBeFound("title.equals=" + DEFAULT_TITLE);

        // Get all the crimeAlertList where title equals to UPDATED_TITLE
        defaultCrimeAlertShouldNotBeFound("title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultCrimeAlertShouldBeFound("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE);

        // Get all the crimeAlertList where title equals to UPDATED_TITLE
        defaultCrimeAlertShouldNotBeFound("title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where title is not null
        defaultCrimeAlertShouldBeFound("title.specified=true");

        // Get all the crimeAlertList where title is null
        defaultCrimeAlertShouldNotBeFound("title.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByTitleContainsSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where title contains DEFAULT_TITLE
        defaultCrimeAlertShouldBeFound("title.contains=" + DEFAULT_TITLE);

        // Get all the crimeAlertList where title contains UPDATED_TITLE
        defaultCrimeAlertShouldNotBeFound("title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where title does not contain DEFAULT_TITLE
        defaultCrimeAlertShouldNotBeFound("title.doesNotContain=" + DEFAULT_TITLE);

        // Get all the crimeAlertList where title does not contain UPDATED_TITLE
        defaultCrimeAlertShouldBeFound("title.doesNotContain=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where description equals to DEFAULT_DESCRIPTION
        defaultCrimeAlertShouldBeFound("description.equals=" + DEFAULT_DESCRIPTION);

        // Get all the crimeAlertList where description equals to UPDATED_DESCRIPTION
        defaultCrimeAlertShouldNotBeFound("description.equals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultCrimeAlertShouldBeFound("description.in=" + DEFAULT_DESCRIPTION + "," + UPDATED_DESCRIPTION);

        // Get all the crimeAlertList where description equals to UPDATED_DESCRIPTION
        defaultCrimeAlertShouldNotBeFound("description.in=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where description is not null
        defaultCrimeAlertShouldBeFound("description.specified=true");

        // Get all the crimeAlertList where description is null
        defaultCrimeAlertShouldNotBeFound("description.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDescriptionContainsSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where description contains DEFAULT_DESCRIPTION
        defaultCrimeAlertShouldBeFound("description.contains=" + DEFAULT_DESCRIPTION);

        // Get all the crimeAlertList where description contains UPDATED_DESCRIPTION
        defaultCrimeAlertShouldNotBeFound("description.contains=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where description does not contain DEFAULT_DESCRIPTION
        defaultCrimeAlertShouldNotBeFound("description.doesNotContain=" + DEFAULT_DESCRIPTION);

        // Get all the crimeAlertList where description does not contain UPDATED_DESCRIPTION
        defaultCrimeAlertShouldBeFound("description.doesNotContain=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat equals to DEFAULT_LAT
        defaultCrimeAlertShouldBeFound("lat.equals=" + DEFAULT_LAT);

        // Get all the crimeAlertList where lat equals to UPDATED_LAT
        defaultCrimeAlertShouldNotBeFound("lat.equals=" + UPDATED_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat in DEFAULT_LAT or UPDATED_LAT
        defaultCrimeAlertShouldBeFound("lat.in=" + DEFAULT_LAT + "," + UPDATED_LAT);

        // Get all the crimeAlertList where lat equals to UPDATED_LAT
        defaultCrimeAlertShouldNotBeFound("lat.in=" + UPDATED_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat is not null
        defaultCrimeAlertShouldBeFound("lat.specified=true");

        // Get all the crimeAlertList where lat is null
        defaultCrimeAlertShouldNotBeFound("lat.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat is greater than or equal to DEFAULT_LAT
        defaultCrimeAlertShouldBeFound("lat.greaterThanOrEqual=" + DEFAULT_LAT);

        // Get all the crimeAlertList where lat is greater than or equal to UPDATED_LAT
        defaultCrimeAlertShouldNotBeFound("lat.greaterThanOrEqual=" + UPDATED_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat is less than or equal to DEFAULT_LAT
        defaultCrimeAlertShouldBeFound("lat.lessThanOrEqual=" + DEFAULT_LAT);

        // Get all the crimeAlertList where lat is less than or equal to SMALLER_LAT
        defaultCrimeAlertShouldNotBeFound("lat.lessThanOrEqual=" + SMALLER_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsLessThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat is less than DEFAULT_LAT
        defaultCrimeAlertShouldNotBeFound("lat.lessThan=" + DEFAULT_LAT);

        // Get all the crimeAlertList where lat is less than UPDATED_LAT
        defaultCrimeAlertShouldBeFound("lat.lessThan=" + UPDATED_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLatIsGreaterThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lat is greater than DEFAULT_LAT
        defaultCrimeAlertShouldNotBeFound("lat.greaterThan=" + DEFAULT_LAT);

        // Get all the crimeAlertList where lat is greater than SMALLER_LAT
        defaultCrimeAlertShouldBeFound("lat.greaterThan=" + SMALLER_LAT);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon equals to DEFAULT_LON
        defaultCrimeAlertShouldBeFound("lon.equals=" + DEFAULT_LON);

        // Get all the crimeAlertList where lon equals to UPDATED_LON
        defaultCrimeAlertShouldNotBeFound("lon.equals=" + UPDATED_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon in DEFAULT_LON or UPDATED_LON
        defaultCrimeAlertShouldBeFound("lon.in=" + DEFAULT_LON + "," + UPDATED_LON);

        // Get all the crimeAlertList where lon equals to UPDATED_LON
        defaultCrimeAlertShouldNotBeFound("lon.in=" + UPDATED_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon is not null
        defaultCrimeAlertShouldBeFound("lon.specified=true");

        // Get all the crimeAlertList where lon is null
        defaultCrimeAlertShouldNotBeFound("lon.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon is greater than or equal to DEFAULT_LON
        defaultCrimeAlertShouldBeFound("lon.greaterThanOrEqual=" + DEFAULT_LON);

        // Get all the crimeAlertList where lon is greater than or equal to UPDATED_LON
        defaultCrimeAlertShouldNotBeFound("lon.greaterThanOrEqual=" + UPDATED_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon is less than or equal to DEFAULT_LON
        defaultCrimeAlertShouldBeFound("lon.lessThanOrEqual=" + DEFAULT_LON);

        // Get all the crimeAlertList where lon is less than or equal to SMALLER_LON
        defaultCrimeAlertShouldNotBeFound("lon.lessThanOrEqual=" + SMALLER_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsLessThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon is less than DEFAULT_LON
        defaultCrimeAlertShouldNotBeFound("lon.lessThan=" + DEFAULT_LON);

        // Get all the crimeAlertList where lon is less than UPDATED_LON
        defaultCrimeAlertShouldBeFound("lon.lessThan=" + UPDATED_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByLonIsGreaterThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where lon is greater than DEFAULT_LON
        defaultCrimeAlertShouldNotBeFound("lon.greaterThan=" + DEFAULT_LON);

        // Get all the crimeAlertList where lon is greater than SMALLER_LON
        defaultCrimeAlertShouldBeFound("lon.greaterThan=" + SMALLER_LON);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDateIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where date equals to DEFAULT_DATE
        defaultCrimeAlertShouldBeFound("date.equals=" + DEFAULT_DATE);

        // Get all the crimeAlertList where date equals to UPDATED_DATE
        defaultCrimeAlertShouldNotBeFound("date.equals=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDateIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where date in DEFAULT_DATE or UPDATED_DATE
        defaultCrimeAlertShouldBeFound("date.in=" + DEFAULT_DATE + "," + UPDATED_DATE);

        // Get all the crimeAlertList where date equals to UPDATED_DATE
        defaultCrimeAlertShouldNotBeFound("date.in=" + UPDATED_DATE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where date is not null
        defaultCrimeAlertShouldBeFound("date.specified=true");

        // Get all the crimeAlertList where date is null
        defaultCrimeAlertShouldNotBeFound("date.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID equals to DEFAULT_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.equals=" + DEFAULT_CRIME_ID);

        // Get all the crimeAlertList where crimeID equals to UPDATED_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.equals=" + UPDATED_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID in DEFAULT_CRIME_ID or UPDATED_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.in=" + DEFAULT_CRIME_ID + "," + UPDATED_CRIME_ID);

        // Get all the crimeAlertList where crimeID equals to UPDATED_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.in=" + UPDATED_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID is not null
        defaultCrimeAlertShouldBeFound("crimeID.specified=true");

        // Get all the crimeAlertList where crimeID is null
        defaultCrimeAlertShouldNotBeFound("crimeID.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID is greater than or equal to DEFAULT_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.greaterThanOrEqual=" + DEFAULT_CRIME_ID);

        // Get all the crimeAlertList where crimeID is greater than or equal to UPDATED_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.greaterThanOrEqual=" + UPDATED_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID is less than or equal to DEFAULT_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.lessThanOrEqual=" + DEFAULT_CRIME_ID);

        // Get all the crimeAlertList where crimeID is less than or equal to SMALLER_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.lessThanOrEqual=" + SMALLER_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsLessThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID is less than DEFAULT_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.lessThan=" + DEFAULT_CRIME_ID);

        // Get all the crimeAlertList where crimeID is less than UPDATED_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.lessThan=" + UPDATED_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeIDIsGreaterThanSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeID is greater than DEFAULT_CRIME_ID
        defaultCrimeAlertShouldNotBeFound("crimeID.greaterThan=" + DEFAULT_CRIME_ID);

        // Get all the crimeAlertList where crimeID is greater than SMALLER_CRIME_ID
        defaultCrimeAlertShouldBeFound("crimeID.greaterThan=" + SMALLER_CRIME_ID);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeType equals to DEFAULT_CRIME_TYPE
        defaultCrimeAlertShouldBeFound("crimeType.equals=" + DEFAULT_CRIME_TYPE);

        // Get all the crimeAlertList where crimeType equals to UPDATED_CRIME_TYPE
        defaultCrimeAlertShouldNotBeFound("crimeType.equals=" + UPDATED_CRIME_TYPE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeTypeIsInShouldWork() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeType in DEFAULT_CRIME_TYPE or UPDATED_CRIME_TYPE
        defaultCrimeAlertShouldBeFound("crimeType.in=" + DEFAULT_CRIME_TYPE + "," + UPDATED_CRIME_TYPE);

        // Get all the crimeAlertList where crimeType equals to UPDATED_CRIME_TYPE
        defaultCrimeAlertShouldNotBeFound("crimeType.in=" + UPDATED_CRIME_TYPE);
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCrimeTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        // Get all the crimeAlertList where crimeType is not null
        defaultCrimeAlertShouldBeFound("crimeType.specified=true");

        // Get all the crimeAlertList where crimeType is null
        defaultCrimeAlertShouldNotBeFound("crimeType.specified=false");
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByPostedbyIsEqualToSomething() throws Exception {
        User postedby;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            crimeAlertRepository.saveAndFlush(crimeAlert);
            postedby = UserResourceIT.createEntity(em);
        } else {
            postedby = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(postedby);
        em.flush();
        crimeAlert.setPostedby(postedby);
        crimeAlertRepository.saveAndFlush(crimeAlert);
        Long postedbyId = postedby.getId();

        // Get all the crimeAlertList where postedby equals to postedbyId
        defaultCrimeAlertShouldBeFound("postedbyId.equals=" + postedbyId);

        // Get all the crimeAlertList where postedby equals to (postedbyId + 1)
        defaultCrimeAlertShouldNotBeFound("postedbyId.equals=" + (postedbyId + 1));
    }

    @Test
    @Transactional
    void getAllCrimeAlertsByCommentsIsEqualToSomething() throws Exception {
        Comment comments;
        if (TestUtil.findAll(em, Comment.class).isEmpty()) {
            crimeAlertRepository.saveAndFlush(crimeAlert);
            comments = CommentResourceIT.createEntity(em);
        } else {
            comments = TestUtil.findAll(em, Comment.class).get(0);
        }
        em.persist(comments);
        em.flush();
        crimeAlert.addComments(comments);
        crimeAlertRepository.saveAndFlush(crimeAlert);
        Long commentsId = comments.getId();

        // Get all the crimeAlertList where comments equals to commentsId
        defaultCrimeAlertShouldBeFound("commentsId.equals=" + commentsId);

        // Get all the crimeAlertList where comments equals to (commentsId + 1)
        defaultCrimeAlertShouldNotBeFound("commentsId.equals=" + (commentsId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultCrimeAlertShouldBeFound(String filter) throws Exception {
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(crimeAlert.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].lat").value(hasItem(sameNumber(DEFAULT_LAT))))
            .andExpect(jsonPath("$.[*].lon").value(hasItem(sameNumber(DEFAULT_LON))))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].crimeID").value(hasItem(DEFAULT_CRIME_ID.intValue())))
            .andExpect(jsonPath("$.[*].crimeType").value(hasItem(DEFAULT_CRIME_TYPE.toString())))
            .andExpect(jsonPath("$.[*].crimePhoto1ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto1").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_1))))
            .andExpect(jsonPath("$.[*].crimePhoto2ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_2_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto2").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_2))))
            .andExpect(jsonPath("$.[*].crimePhoto3ContentType").value(hasItem(DEFAULT_CRIME_PHOTO_3_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].crimePhoto3").value(hasItem(Base64Utils.encodeToString(DEFAULT_CRIME_PHOTO_3))));

        // Check, that the count call also returns 1
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultCrimeAlertShouldNotBeFound(String filter) throws Exception {
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restCrimeAlertMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingCrimeAlert() throws Exception {
        // Get the crimeAlert
        restCrimeAlertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCrimeAlert() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();

        // Update the crimeAlert
        CrimeAlert updatedCrimeAlert = crimeAlertRepository.findById(crimeAlert.getId()).get();
        // Disconnect from session so that the updates on updatedCrimeAlert are not directly saved in db
        em.detach(updatedCrimeAlert);
        updatedCrimeAlert
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .lat(UPDATED_LAT)
            .lon(UPDATED_LON)
            .date(UPDATED_DATE)
            .crimeID(UPDATED_CRIME_ID)
            .crimeType(UPDATED_CRIME_TYPE)
            .crimePhoto1(UPDATED_CRIME_PHOTO_1)
            .crimePhoto1ContentType(UPDATED_CRIME_PHOTO_1_CONTENT_TYPE)
            .crimePhoto2(UPDATED_CRIME_PHOTO_2)
            .crimePhoto2ContentType(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE)
            .crimePhoto3(UPDATED_CRIME_PHOTO_3)
            .crimePhoto3ContentType(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(updatedCrimeAlert);

        restCrimeAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, crimeAlertDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isOk());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
        CrimeAlert testCrimeAlert = crimeAlertList.get(crimeAlertList.size() - 1);
        assertThat(testCrimeAlert.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCrimeAlert.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCrimeAlert.getLat()).isEqualByComparingTo(UPDATED_LAT);
        assertThat(testCrimeAlert.getLon()).isEqualByComparingTo(UPDATED_LON);
        assertThat(testCrimeAlert.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testCrimeAlert.getCrimeID()).isEqualTo(UPDATED_CRIME_ID);
        assertThat(testCrimeAlert.getCrimeType()).isEqualTo(UPDATED_CRIME_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto1()).isEqualTo(UPDATED_CRIME_PHOTO_1);
        assertThat(testCrimeAlert.getCrimePhoto1ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_1_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto2()).isEqualTo(UPDATED_CRIME_PHOTO_2);
        assertThat(testCrimeAlert.getCrimePhoto2ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto3()).isEqualTo(UPDATED_CRIME_PHOTO_3);
        assertThat(testCrimeAlert.getCrimePhoto3ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, crimeAlertDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCrimeAlertWithPatch() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();

        // Update the crimeAlert using partial update
        CrimeAlert partialUpdatedCrimeAlert = new CrimeAlert();
        partialUpdatedCrimeAlert.setId(crimeAlert.getId());

        partialUpdatedCrimeAlert
            .title(UPDATED_TITLE)
            .lat(UPDATED_LAT)
            .lon(UPDATED_LON)
            .crimeID(UPDATED_CRIME_ID)
            .crimeType(UPDATED_CRIME_TYPE)
            .crimePhoto2(UPDATED_CRIME_PHOTO_2)
            .crimePhoto2ContentType(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE)
            .crimePhoto3(UPDATED_CRIME_PHOTO_3)
            .crimePhoto3ContentType(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);

        restCrimeAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrimeAlert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCrimeAlert))
            )
            .andExpect(status().isOk());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
        CrimeAlert testCrimeAlert = crimeAlertList.get(crimeAlertList.size() - 1);
        assertThat(testCrimeAlert.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCrimeAlert.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCrimeAlert.getLat()).isEqualByComparingTo(UPDATED_LAT);
        assertThat(testCrimeAlert.getLon()).isEqualByComparingTo(UPDATED_LON);
        assertThat(testCrimeAlert.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testCrimeAlert.getCrimeID()).isEqualTo(UPDATED_CRIME_ID);
        assertThat(testCrimeAlert.getCrimeType()).isEqualTo(UPDATED_CRIME_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto1()).isEqualTo(DEFAULT_CRIME_PHOTO_1);
        assertThat(testCrimeAlert.getCrimePhoto1ContentType()).isEqualTo(DEFAULT_CRIME_PHOTO_1_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto2()).isEqualTo(UPDATED_CRIME_PHOTO_2);
        assertThat(testCrimeAlert.getCrimePhoto2ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto3()).isEqualTo(UPDATED_CRIME_PHOTO_3);
        assertThat(testCrimeAlert.getCrimePhoto3ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateCrimeAlertWithPatch() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();

        // Update the crimeAlert using partial update
        CrimeAlert partialUpdatedCrimeAlert = new CrimeAlert();
        partialUpdatedCrimeAlert.setId(crimeAlert.getId());

        partialUpdatedCrimeAlert
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .lat(UPDATED_LAT)
            .lon(UPDATED_LON)
            .date(UPDATED_DATE)
            .crimeID(UPDATED_CRIME_ID)
            .crimeType(UPDATED_CRIME_TYPE)
            .crimePhoto1(UPDATED_CRIME_PHOTO_1)
            .crimePhoto1ContentType(UPDATED_CRIME_PHOTO_1_CONTENT_TYPE)
            .crimePhoto2(UPDATED_CRIME_PHOTO_2)
            .crimePhoto2ContentType(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE)
            .crimePhoto3(UPDATED_CRIME_PHOTO_3)
            .crimePhoto3ContentType(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);

        restCrimeAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCrimeAlert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCrimeAlert))
            )
            .andExpect(status().isOk());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
        CrimeAlert testCrimeAlert = crimeAlertList.get(crimeAlertList.size() - 1);
        assertThat(testCrimeAlert.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCrimeAlert.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCrimeAlert.getLat()).isEqualByComparingTo(UPDATED_LAT);
        assertThat(testCrimeAlert.getLon()).isEqualByComparingTo(UPDATED_LON);
        assertThat(testCrimeAlert.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testCrimeAlert.getCrimeID()).isEqualTo(UPDATED_CRIME_ID);
        assertThat(testCrimeAlert.getCrimeType()).isEqualTo(UPDATED_CRIME_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto1()).isEqualTo(UPDATED_CRIME_PHOTO_1);
        assertThat(testCrimeAlert.getCrimePhoto1ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_1_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto2()).isEqualTo(UPDATED_CRIME_PHOTO_2);
        assertThat(testCrimeAlert.getCrimePhoto2ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_2_CONTENT_TYPE);
        assertThat(testCrimeAlert.getCrimePhoto3()).isEqualTo(UPDATED_CRIME_PHOTO_3);
        assertThat(testCrimeAlert.getCrimePhoto3ContentType()).isEqualTo(UPDATED_CRIME_PHOTO_3_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, crimeAlertDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCrimeAlert() throws Exception {
        int databaseSizeBeforeUpdate = crimeAlertRepository.findAll().size();
        crimeAlert.setId(count.incrementAndGet());

        // Create the CrimeAlert
        CrimeAlertDTO crimeAlertDTO = crimeAlertMapper.toDto(crimeAlert);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCrimeAlertMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(crimeAlertDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CrimeAlert in the database
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCrimeAlert() throws Exception {
        // Initialize the database
        crimeAlertRepository.saveAndFlush(crimeAlert);

        int databaseSizeBeforeDelete = crimeAlertRepository.findAll().size();

        // Delete the crimeAlert
        restCrimeAlertMockMvc
            .perform(delete(ENTITY_API_URL_ID, crimeAlert.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CrimeAlert> crimeAlertList = crimeAlertRepository.findAll();
        assertThat(crimeAlertList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
