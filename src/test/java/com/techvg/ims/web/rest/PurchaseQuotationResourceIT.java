package com.techvg.ims.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techvg.ims.IntegrationTest;
import com.techvg.ims.domain.GoodsRecived;
import com.techvg.ims.domain.ProductInventory;
import com.techvg.ims.domain.PurchaseQuotation;
import com.techvg.ims.domain.PurchaseQuotationDetails;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.enumeration.OrderType;
import com.techvg.ims.domain.enumeration.Status;
import com.techvg.ims.repository.PurchaseQuotationRepository;
import com.techvg.ims.service.PurchaseQuotationService;
import com.techvg.ims.service.criteria.PurchaseQuotationCriteria;
import com.techvg.ims.service.dto.PurchaseQuotationDTO;
import com.techvg.ims.service.mapper.PurchaseQuotationMapper;
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

/**
 * Integration tests for the {@link PurchaseQuotationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PurchaseQuotationResourceIT {

    private static final Double DEFAULT_TOTAL_PO_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_PO_AMOUNT = 2D;
    private static final Double SMALLER_TOTAL_PO_AMOUNT = 1D - 1D;

    private static final Double DEFAULT_TOTAL_GST_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_GST_AMOUNT = 2D;
    private static final Double SMALLER_TOTAL_GST_AMOUNT = 1D - 1D;

    private static final Instant DEFAULT_EXPECTED_DELIVERY_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPECTED_DELIVERY_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_PO_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PO_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final OrderType DEFAULT_ORDER_TYPE = OrderType.PURCHASE_ORDER;
    private static final OrderType UPDATED_ORDER_TYPE = OrderType.PRODUCT_QUATATION;

    private static final Status DEFAULT_ORDER_STATUS = Status.REQUESTED;
    private static final Status UPDATED_ORDER_STATUS = Status.APPROVED;

    private static final String DEFAULT_CLIENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CLIENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CLIENT_MOBILE = "AAAAAAAAAA";
    private static final String UPDATED_CLIENT_MOBILE = "BBBBBBBBBB";

    private static final String DEFAULT_CLIENT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_CLIENT_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TERMS_AND_CONDITION = "AAAAAAAAAA";
    private static final String UPDATED_TERMS_AND_CONDITION = "BBBBBBBBBB";

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_MODIFIED = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_FREE_FIELD_1 = "AAAAAAAAAA";
    private static final String UPDATED_FREE_FIELD_1 = "BBBBBBBBBB";

    private static final String DEFAULT_FREE_FIELD_2 = "AAAAAAAAAA";
    private static final String UPDATED_FREE_FIELD_2 = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/purchase-quotations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PurchaseQuotationRepository purchaseQuotationRepository;

    @Mock
    private PurchaseQuotationRepository purchaseQuotationRepositoryMock;

    @Autowired
    private PurchaseQuotationMapper purchaseQuotationMapper;

    @Mock
    private PurchaseQuotationService purchaseQuotationServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseQuotationMockMvc;

    private PurchaseQuotation purchaseQuotation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseQuotation createEntity(EntityManager em) {
        PurchaseQuotation purchaseQuotation = new PurchaseQuotation()
            .totalPOAmount(DEFAULT_TOTAL_PO_AMOUNT)
            .totalGSTAmount(DEFAULT_TOTAL_GST_AMOUNT)
            .expectedDeliveryDate(DEFAULT_EXPECTED_DELIVERY_DATE)
            .poDate(DEFAULT_PO_DATE)
            .orderType(DEFAULT_ORDER_TYPE)
            .orderStatus(DEFAULT_ORDER_STATUS)
            .clientName(DEFAULT_CLIENT_NAME)
            .clientMobile(DEFAULT_CLIENT_MOBILE)
            .clientEmail(DEFAULT_CLIENT_EMAIL)
            .termsAndCondition(DEFAULT_TERMS_AND_CONDITION)
            .notes(DEFAULT_NOTES)
            .lastModified(DEFAULT_LAST_MODIFIED)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .freeField1(DEFAULT_FREE_FIELD_1)
            .freeField2(DEFAULT_FREE_FIELD_2);
        return purchaseQuotation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseQuotation createUpdatedEntity(EntityManager em) {
        PurchaseQuotation purchaseQuotation = new PurchaseQuotation()
            .totalPOAmount(UPDATED_TOTAL_PO_AMOUNT)
            .totalGSTAmount(UPDATED_TOTAL_GST_AMOUNT)
            .expectedDeliveryDate(UPDATED_EXPECTED_DELIVERY_DATE)
            .poDate(UPDATED_PO_DATE)
            .orderType(UPDATED_ORDER_TYPE)
            .orderStatus(UPDATED_ORDER_STATUS)
            .clientName(UPDATED_CLIENT_NAME)
            .clientMobile(UPDATED_CLIENT_MOBILE)
            .clientEmail(UPDATED_CLIENT_EMAIL)
            .termsAndCondition(UPDATED_TERMS_AND_CONDITION)
            .notes(UPDATED_NOTES)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2);
        return purchaseQuotation;
    }

    @BeforeEach
    public void initTest() {
        purchaseQuotation = createEntity(em);
    }

    @Test
    @Transactional
    void createPurchaseQuotation() throws Exception {
        int databaseSizeBeforeCreate = purchaseQuotationRepository.findAll().size();
        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);
        restPurchaseQuotationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isCreated());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeCreate + 1);
        PurchaseQuotation testPurchaseQuotation = purchaseQuotationList.get(purchaseQuotationList.size() - 1);
        assertThat(testPurchaseQuotation.getTotalPOAmount()).isEqualTo(DEFAULT_TOTAL_PO_AMOUNT);
        assertThat(testPurchaseQuotation.getTotalGSTAmount()).isEqualTo(DEFAULT_TOTAL_GST_AMOUNT);
        assertThat(testPurchaseQuotation.getExpectedDeliveryDate()).isEqualTo(DEFAULT_EXPECTED_DELIVERY_DATE);
        assertThat(testPurchaseQuotation.getPoDate()).isEqualTo(DEFAULT_PO_DATE);
        assertThat(testPurchaseQuotation.getOrderType()).isEqualTo(DEFAULT_ORDER_TYPE);
        assertThat(testPurchaseQuotation.getOrderStatus()).isEqualTo(DEFAULT_ORDER_STATUS);
        assertThat(testPurchaseQuotation.getClientName()).isEqualTo(DEFAULT_CLIENT_NAME);
        assertThat(testPurchaseQuotation.getClientMobile()).isEqualTo(DEFAULT_CLIENT_MOBILE);
        assertThat(testPurchaseQuotation.getClientEmail()).isEqualTo(DEFAULT_CLIENT_EMAIL);
        assertThat(testPurchaseQuotation.getTermsAndCondition()).isEqualTo(DEFAULT_TERMS_AND_CONDITION);
        assertThat(testPurchaseQuotation.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testPurchaseQuotation.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
        assertThat(testPurchaseQuotation.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testPurchaseQuotation.getFreeField1()).isEqualTo(DEFAULT_FREE_FIELD_1);
        assertThat(testPurchaseQuotation.getFreeField2()).isEqualTo(DEFAULT_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void createPurchaseQuotationWithExistingId() throws Exception {
        // Create the PurchaseQuotation with an existing ID
        purchaseQuotation.setId(1L);
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        int databaseSizeBeforeCreate = purchaseQuotationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseQuotationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLastModifiedIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseQuotationRepository.findAll().size();
        // set the field null
        purchaseQuotation.setLastModified(null);

        // Create the PurchaseQuotation, which fails.
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        restPurchaseQuotationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastModifiedByIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseQuotationRepository.findAll().size();
        // set the field null
        purchaseQuotation.setLastModifiedBy(null);

        // Create the PurchaseQuotation, which fails.
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        restPurchaseQuotationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotations() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseQuotation.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalPOAmount").value(hasItem(DEFAULT_TOTAL_PO_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].totalGSTAmount").value(hasItem(DEFAULT_TOTAL_GST_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].expectedDeliveryDate").value(hasItem(DEFAULT_EXPECTED_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].poDate").value(hasItem(DEFAULT_PO_DATE.toString())))
            .andExpect(jsonPath("$.[*].orderType").value(hasItem(DEFAULT_ORDER_TYPE.toString())))
            .andExpect(jsonPath("$.[*].orderStatus").value(hasItem(DEFAULT_ORDER_STATUS.toString())))
            .andExpect(jsonPath("$.[*].clientName").value(hasItem(DEFAULT_CLIENT_NAME)))
            .andExpect(jsonPath("$.[*].clientMobile").value(hasItem(DEFAULT_CLIENT_MOBILE)))
            .andExpect(jsonPath("$.[*].clientEmail").value(hasItem(DEFAULT_CLIENT_EMAIL)))
            .andExpect(jsonPath("$.[*].termsAndCondition").value(hasItem(DEFAULT_TERMS_AND_CONDITION)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED)))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].freeField1").value(hasItem(DEFAULT_FREE_FIELD_1)))
            .andExpect(jsonPath("$.[*].freeField2").value(hasItem(DEFAULT_FREE_FIELD_2)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseQuotationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(purchaseQuotationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseQuotationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(purchaseQuotationServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPurchaseQuotationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(purchaseQuotationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPurchaseQuotationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(purchaseQuotationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPurchaseQuotation() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get the purchaseQuotation
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseQuotation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseQuotation.getId().intValue()))
            .andExpect(jsonPath("$.totalPOAmount").value(DEFAULT_TOTAL_PO_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.totalGSTAmount").value(DEFAULT_TOTAL_GST_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.expectedDeliveryDate").value(DEFAULT_EXPECTED_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.poDate").value(DEFAULT_PO_DATE.toString()))
            .andExpect(jsonPath("$.orderType").value(DEFAULT_ORDER_TYPE.toString()))
            .andExpect(jsonPath("$.orderStatus").value(DEFAULT_ORDER_STATUS.toString()))
            .andExpect(jsonPath("$.clientName").value(DEFAULT_CLIENT_NAME))
            .andExpect(jsonPath("$.clientMobile").value(DEFAULT_CLIENT_MOBILE))
            .andExpect(jsonPath("$.clientEmail").value(DEFAULT_CLIENT_EMAIL))
            .andExpect(jsonPath("$.termsAndCondition").value(DEFAULT_TERMS_AND_CONDITION))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.freeField1").value(DEFAULT_FREE_FIELD_1))
            .andExpect(jsonPath("$.freeField2").value(DEFAULT_FREE_FIELD_2));
    }

    @Test
    @Transactional
    void getPurchaseQuotationsByIdFiltering() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        Long id = purchaseQuotation.getId();

        defaultPurchaseQuotationShouldBeFound("id.equals=" + id);
        defaultPurchaseQuotationShouldNotBeFound("id.notEquals=" + id);

        defaultPurchaseQuotationShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultPurchaseQuotationShouldNotBeFound("id.greaterThan=" + id);

        defaultPurchaseQuotationShouldBeFound("id.lessThanOrEqual=" + id);
        defaultPurchaseQuotationShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount equals to DEFAULT_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.equals=" + DEFAULT_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount equals to UPDATED_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.equals=" + UPDATED_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount in DEFAULT_TOTAL_PO_AMOUNT or UPDATED_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.in=" + DEFAULT_TOTAL_PO_AMOUNT + "," + UPDATED_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount equals to UPDATED_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.in=" + UPDATED_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount is not null
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.specified=true");

        // Get all the purchaseQuotationList where totalPOAmount is null
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount is greater than or equal to DEFAULT_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.greaterThanOrEqual=" + DEFAULT_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount is greater than or equal to UPDATED_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.greaterThanOrEqual=" + UPDATED_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount is less than or equal to DEFAULT_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.lessThanOrEqual=" + DEFAULT_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount is less than or equal to SMALLER_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.lessThanOrEqual=" + SMALLER_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsLessThanSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount is less than DEFAULT_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.lessThan=" + DEFAULT_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount is less than UPDATED_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.lessThan=" + UPDATED_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalPOAmountIsGreaterThanSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalPOAmount is greater than DEFAULT_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalPOAmount.greaterThan=" + DEFAULT_TOTAL_PO_AMOUNT);

        // Get all the purchaseQuotationList where totalPOAmount is greater than SMALLER_TOTAL_PO_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalPOAmount.greaterThan=" + SMALLER_TOTAL_PO_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount equals to DEFAULT_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.equals=" + DEFAULT_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount equals to UPDATED_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.equals=" + UPDATED_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount in DEFAULT_TOTAL_GST_AMOUNT or UPDATED_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.in=" + DEFAULT_TOTAL_GST_AMOUNT + "," + UPDATED_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount equals to UPDATED_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.in=" + UPDATED_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount is not null
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.specified=true");

        // Get all the purchaseQuotationList where totalGSTAmount is null
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount is greater than or equal to DEFAULT_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.greaterThanOrEqual=" + DEFAULT_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount is greater than or equal to UPDATED_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.greaterThanOrEqual=" + UPDATED_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount is less than or equal to DEFAULT_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.lessThanOrEqual=" + DEFAULT_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount is less than or equal to SMALLER_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.lessThanOrEqual=" + SMALLER_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsLessThanSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount is less than DEFAULT_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.lessThan=" + DEFAULT_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount is less than UPDATED_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.lessThan=" + UPDATED_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTotalGSTAmountIsGreaterThanSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where totalGSTAmount is greater than DEFAULT_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldNotBeFound("totalGSTAmount.greaterThan=" + DEFAULT_TOTAL_GST_AMOUNT);

        // Get all the purchaseQuotationList where totalGSTAmount is greater than SMALLER_TOTAL_GST_AMOUNT
        defaultPurchaseQuotationShouldBeFound("totalGSTAmount.greaterThan=" + SMALLER_TOTAL_GST_AMOUNT);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByExpectedDeliveryDateIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where expectedDeliveryDate equals to DEFAULT_EXPECTED_DELIVERY_DATE
        defaultPurchaseQuotationShouldBeFound("expectedDeliveryDate.equals=" + DEFAULT_EXPECTED_DELIVERY_DATE);

        // Get all the purchaseQuotationList where expectedDeliveryDate equals to UPDATED_EXPECTED_DELIVERY_DATE
        defaultPurchaseQuotationShouldNotBeFound("expectedDeliveryDate.equals=" + UPDATED_EXPECTED_DELIVERY_DATE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByExpectedDeliveryDateIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where expectedDeliveryDate in DEFAULT_EXPECTED_DELIVERY_DATE or UPDATED_EXPECTED_DELIVERY_DATE
        defaultPurchaseQuotationShouldBeFound(
            "expectedDeliveryDate.in=" + DEFAULT_EXPECTED_DELIVERY_DATE + "," + UPDATED_EXPECTED_DELIVERY_DATE
        );

        // Get all the purchaseQuotationList where expectedDeliveryDate equals to UPDATED_EXPECTED_DELIVERY_DATE
        defaultPurchaseQuotationShouldNotBeFound("expectedDeliveryDate.in=" + UPDATED_EXPECTED_DELIVERY_DATE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByExpectedDeliveryDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where expectedDeliveryDate is not null
        defaultPurchaseQuotationShouldBeFound("expectedDeliveryDate.specified=true");

        // Get all the purchaseQuotationList where expectedDeliveryDate is null
        defaultPurchaseQuotationShouldNotBeFound("expectedDeliveryDate.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByPoDateIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where poDate equals to DEFAULT_PO_DATE
        defaultPurchaseQuotationShouldBeFound("poDate.equals=" + DEFAULT_PO_DATE);

        // Get all the purchaseQuotationList where poDate equals to UPDATED_PO_DATE
        defaultPurchaseQuotationShouldNotBeFound("poDate.equals=" + UPDATED_PO_DATE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByPoDateIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where poDate in DEFAULT_PO_DATE or UPDATED_PO_DATE
        defaultPurchaseQuotationShouldBeFound("poDate.in=" + DEFAULT_PO_DATE + "," + UPDATED_PO_DATE);

        // Get all the purchaseQuotationList where poDate equals to UPDATED_PO_DATE
        defaultPurchaseQuotationShouldNotBeFound("poDate.in=" + UPDATED_PO_DATE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByPoDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where poDate is not null
        defaultPurchaseQuotationShouldBeFound("poDate.specified=true");

        // Get all the purchaseQuotationList where poDate is null
        defaultPurchaseQuotationShouldNotBeFound("poDate.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderType equals to DEFAULT_ORDER_TYPE
        defaultPurchaseQuotationShouldBeFound("orderType.equals=" + DEFAULT_ORDER_TYPE);

        // Get all the purchaseQuotationList where orderType equals to UPDATED_ORDER_TYPE
        defaultPurchaseQuotationShouldNotBeFound("orderType.equals=" + UPDATED_ORDER_TYPE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderTypeIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderType in DEFAULT_ORDER_TYPE or UPDATED_ORDER_TYPE
        defaultPurchaseQuotationShouldBeFound("orderType.in=" + DEFAULT_ORDER_TYPE + "," + UPDATED_ORDER_TYPE);

        // Get all the purchaseQuotationList where orderType equals to UPDATED_ORDER_TYPE
        defaultPurchaseQuotationShouldNotBeFound("orderType.in=" + UPDATED_ORDER_TYPE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderType is not null
        defaultPurchaseQuotationShouldBeFound("orderType.specified=true");

        // Get all the purchaseQuotationList where orderType is null
        defaultPurchaseQuotationShouldNotBeFound("orderType.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderStatus equals to DEFAULT_ORDER_STATUS
        defaultPurchaseQuotationShouldBeFound("orderStatus.equals=" + DEFAULT_ORDER_STATUS);

        // Get all the purchaseQuotationList where orderStatus equals to UPDATED_ORDER_STATUS
        defaultPurchaseQuotationShouldNotBeFound("orderStatus.equals=" + UPDATED_ORDER_STATUS);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderStatusIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderStatus in DEFAULT_ORDER_STATUS or UPDATED_ORDER_STATUS
        defaultPurchaseQuotationShouldBeFound("orderStatus.in=" + DEFAULT_ORDER_STATUS + "," + UPDATED_ORDER_STATUS);

        // Get all the purchaseQuotationList where orderStatus equals to UPDATED_ORDER_STATUS
        defaultPurchaseQuotationShouldNotBeFound("orderStatus.in=" + UPDATED_ORDER_STATUS);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByOrderStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where orderStatus is not null
        defaultPurchaseQuotationShouldBeFound("orderStatus.specified=true");

        // Get all the purchaseQuotationList where orderStatus is null
        defaultPurchaseQuotationShouldNotBeFound("orderStatus.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientNameIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientName equals to DEFAULT_CLIENT_NAME
        defaultPurchaseQuotationShouldBeFound("clientName.equals=" + DEFAULT_CLIENT_NAME);

        // Get all the purchaseQuotationList where clientName equals to UPDATED_CLIENT_NAME
        defaultPurchaseQuotationShouldNotBeFound("clientName.equals=" + UPDATED_CLIENT_NAME);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientNameIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientName in DEFAULT_CLIENT_NAME or UPDATED_CLIENT_NAME
        defaultPurchaseQuotationShouldBeFound("clientName.in=" + DEFAULT_CLIENT_NAME + "," + UPDATED_CLIENT_NAME);

        // Get all the purchaseQuotationList where clientName equals to UPDATED_CLIENT_NAME
        defaultPurchaseQuotationShouldNotBeFound("clientName.in=" + UPDATED_CLIENT_NAME);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientName is not null
        defaultPurchaseQuotationShouldBeFound("clientName.specified=true");

        // Get all the purchaseQuotationList where clientName is null
        defaultPurchaseQuotationShouldNotBeFound("clientName.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientNameContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientName contains DEFAULT_CLIENT_NAME
        defaultPurchaseQuotationShouldBeFound("clientName.contains=" + DEFAULT_CLIENT_NAME);

        // Get all the purchaseQuotationList where clientName contains UPDATED_CLIENT_NAME
        defaultPurchaseQuotationShouldNotBeFound("clientName.contains=" + UPDATED_CLIENT_NAME);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientNameNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientName does not contain DEFAULT_CLIENT_NAME
        defaultPurchaseQuotationShouldNotBeFound("clientName.doesNotContain=" + DEFAULT_CLIENT_NAME);

        // Get all the purchaseQuotationList where clientName does not contain UPDATED_CLIENT_NAME
        defaultPurchaseQuotationShouldBeFound("clientName.doesNotContain=" + UPDATED_CLIENT_NAME);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientMobileIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientMobile equals to DEFAULT_CLIENT_MOBILE
        defaultPurchaseQuotationShouldBeFound("clientMobile.equals=" + DEFAULT_CLIENT_MOBILE);

        // Get all the purchaseQuotationList where clientMobile equals to UPDATED_CLIENT_MOBILE
        defaultPurchaseQuotationShouldNotBeFound("clientMobile.equals=" + UPDATED_CLIENT_MOBILE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientMobileIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientMobile in DEFAULT_CLIENT_MOBILE or UPDATED_CLIENT_MOBILE
        defaultPurchaseQuotationShouldBeFound("clientMobile.in=" + DEFAULT_CLIENT_MOBILE + "," + UPDATED_CLIENT_MOBILE);

        // Get all the purchaseQuotationList where clientMobile equals to UPDATED_CLIENT_MOBILE
        defaultPurchaseQuotationShouldNotBeFound("clientMobile.in=" + UPDATED_CLIENT_MOBILE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientMobileIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientMobile is not null
        defaultPurchaseQuotationShouldBeFound("clientMobile.specified=true");

        // Get all the purchaseQuotationList where clientMobile is null
        defaultPurchaseQuotationShouldNotBeFound("clientMobile.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientMobileContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientMobile contains DEFAULT_CLIENT_MOBILE
        defaultPurchaseQuotationShouldBeFound("clientMobile.contains=" + DEFAULT_CLIENT_MOBILE);

        // Get all the purchaseQuotationList where clientMobile contains UPDATED_CLIENT_MOBILE
        defaultPurchaseQuotationShouldNotBeFound("clientMobile.contains=" + UPDATED_CLIENT_MOBILE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientMobileNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientMobile does not contain DEFAULT_CLIENT_MOBILE
        defaultPurchaseQuotationShouldNotBeFound("clientMobile.doesNotContain=" + DEFAULT_CLIENT_MOBILE);

        // Get all the purchaseQuotationList where clientMobile does not contain UPDATED_CLIENT_MOBILE
        defaultPurchaseQuotationShouldBeFound("clientMobile.doesNotContain=" + UPDATED_CLIENT_MOBILE);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientEmailIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientEmail equals to DEFAULT_CLIENT_EMAIL
        defaultPurchaseQuotationShouldBeFound("clientEmail.equals=" + DEFAULT_CLIENT_EMAIL);

        // Get all the purchaseQuotationList where clientEmail equals to UPDATED_CLIENT_EMAIL
        defaultPurchaseQuotationShouldNotBeFound("clientEmail.equals=" + UPDATED_CLIENT_EMAIL);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientEmailIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientEmail in DEFAULT_CLIENT_EMAIL or UPDATED_CLIENT_EMAIL
        defaultPurchaseQuotationShouldBeFound("clientEmail.in=" + DEFAULT_CLIENT_EMAIL + "," + UPDATED_CLIENT_EMAIL);

        // Get all the purchaseQuotationList where clientEmail equals to UPDATED_CLIENT_EMAIL
        defaultPurchaseQuotationShouldNotBeFound("clientEmail.in=" + UPDATED_CLIENT_EMAIL);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientEmailIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientEmail is not null
        defaultPurchaseQuotationShouldBeFound("clientEmail.specified=true");

        // Get all the purchaseQuotationList where clientEmail is null
        defaultPurchaseQuotationShouldNotBeFound("clientEmail.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientEmailContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientEmail contains DEFAULT_CLIENT_EMAIL
        defaultPurchaseQuotationShouldBeFound("clientEmail.contains=" + DEFAULT_CLIENT_EMAIL);

        // Get all the purchaseQuotationList where clientEmail contains UPDATED_CLIENT_EMAIL
        defaultPurchaseQuotationShouldNotBeFound("clientEmail.contains=" + UPDATED_CLIENT_EMAIL);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByClientEmailNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where clientEmail does not contain DEFAULT_CLIENT_EMAIL
        defaultPurchaseQuotationShouldNotBeFound("clientEmail.doesNotContain=" + DEFAULT_CLIENT_EMAIL);

        // Get all the purchaseQuotationList where clientEmail does not contain UPDATED_CLIENT_EMAIL
        defaultPurchaseQuotationShouldBeFound("clientEmail.doesNotContain=" + UPDATED_CLIENT_EMAIL);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTermsAndConditionIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where termsAndCondition equals to DEFAULT_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldBeFound("termsAndCondition.equals=" + DEFAULT_TERMS_AND_CONDITION);

        // Get all the purchaseQuotationList where termsAndCondition equals to UPDATED_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldNotBeFound("termsAndCondition.equals=" + UPDATED_TERMS_AND_CONDITION);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTermsAndConditionIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where termsAndCondition in DEFAULT_TERMS_AND_CONDITION or UPDATED_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldBeFound("termsAndCondition.in=" + DEFAULT_TERMS_AND_CONDITION + "," + UPDATED_TERMS_AND_CONDITION);

        // Get all the purchaseQuotationList where termsAndCondition equals to UPDATED_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldNotBeFound("termsAndCondition.in=" + UPDATED_TERMS_AND_CONDITION);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTermsAndConditionIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where termsAndCondition is not null
        defaultPurchaseQuotationShouldBeFound("termsAndCondition.specified=true");

        // Get all the purchaseQuotationList where termsAndCondition is null
        defaultPurchaseQuotationShouldNotBeFound("termsAndCondition.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTermsAndConditionContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where termsAndCondition contains DEFAULT_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldBeFound("termsAndCondition.contains=" + DEFAULT_TERMS_AND_CONDITION);

        // Get all the purchaseQuotationList where termsAndCondition contains UPDATED_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldNotBeFound("termsAndCondition.contains=" + UPDATED_TERMS_AND_CONDITION);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByTermsAndConditionNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where termsAndCondition does not contain DEFAULT_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldNotBeFound("termsAndCondition.doesNotContain=" + DEFAULT_TERMS_AND_CONDITION);

        // Get all the purchaseQuotationList where termsAndCondition does not contain UPDATED_TERMS_AND_CONDITION
        defaultPurchaseQuotationShouldBeFound("termsAndCondition.doesNotContain=" + UPDATED_TERMS_AND_CONDITION);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByNotesIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where notes equals to DEFAULT_NOTES
        defaultPurchaseQuotationShouldBeFound("notes.equals=" + DEFAULT_NOTES);

        // Get all the purchaseQuotationList where notes equals to UPDATED_NOTES
        defaultPurchaseQuotationShouldNotBeFound("notes.equals=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByNotesIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where notes in DEFAULT_NOTES or UPDATED_NOTES
        defaultPurchaseQuotationShouldBeFound("notes.in=" + DEFAULT_NOTES + "," + UPDATED_NOTES);

        // Get all the purchaseQuotationList where notes equals to UPDATED_NOTES
        defaultPurchaseQuotationShouldNotBeFound("notes.in=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByNotesIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where notes is not null
        defaultPurchaseQuotationShouldBeFound("notes.specified=true");

        // Get all the purchaseQuotationList where notes is null
        defaultPurchaseQuotationShouldNotBeFound("notes.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByNotesContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where notes contains DEFAULT_NOTES
        defaultPurchaseQuotationShouldBeFound("notes.contains=" + DEFAULT_NOTES);

        // Get all the purchaseQuotationList where notes contains UPDATED_NOTES
        defaultPurchaseQuotationShouldNotBeFound("notes.contains=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByNotesNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where notes does not contain DEFAULT_NOTES
        defaultPurchaseQuotationShouldNotBeFound("notes.doesNotContain=" + DEFAULT_NOTES);

        // Get all the purchaseQuotationList where notes does not contain UPDATED_NOTES
        defaultPurchaseQuotationShouldBeFound("notes.doesNotContain=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModified equals to DEFAULT_LAST_MODIFIED
        defaultPurchaseQuotationShouldBeFound("lastModified.equals=" + DEFAULT_LAST_MODIFIED);

        // Get all the purchaseQuotationList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultPurchaseQuotationShouldNotBeFound("lastModified.equals=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModified in DEFAULT_LAST_MODIFIED or UPDATED_LAST_MODIFIED
        defaultPurchaseQuotationShouldBeFound("lastModified.in=" + DEFAULT_LAST_MODIFIED + "," + UPDATED_LAST_MODIFIED);

        // Get all the purchaseQuotationList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultPurchaseQuotationShouldNotBeFound("lastModified.in=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModified is not null
        defaultPurchaseQuotationShouldBeFound("lastModified.specified=true");

        // Get all the purchaseQuotationList where lastModified is null
        defaultPurchaseQuotationShouldNotBeFound("lastModified.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModified contains DEFAULT_LAST_MODIFIED
        defaultPurchaseQuotationShouldBeFound("lastModified.contains=" + DEFAULT_LAST_MODIFIED);

        // Get all the purchaseQuotationList where lastModified contains UPDATED_LAST_MODIFIED
        defaultPurchaseQuotationShouldNotBeFound("lastModified.contains=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModified does not contain DEFAULT_LAST_MODIFIED
        defaultPurchaseQuotationShouldNotBeFound("lastModified.doesNotContain=" + DEFAULT_LAST_MODIFIED);

        // Get all the purchaseQuotationList where lastModified does not contain UPDATED_LAST_MODIFIED
        defaultPurchaseQuotationShouldBeFound("lastModified.doesNotContain=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedByIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModifiedBy equals to DEFAULT_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldBeFound("lastModifiedBy.equals=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the purchaseQuotationList where lastModifiedBy equals to UPDATED_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldNotBeFound("lastModifiedBy.equals=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedByIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModifiedBy in DEFAULT_LAST_MODIFIED_BY or UPDATED_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldBeFound("lastModifiedBy.in=" + DEFAULT_LAST_MODIFIED_BY + "," + UPDATED_LAST_MODIFIED_BY);

        // Get all the purchaseQuotationList where lastModifiedBy equals to UPDATED_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldNotBeFound("lastModifiedBy.in=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedByIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModifiedBy is not null
        defaultPurchaseQuotationShouldBeFound("lastModifiedBy.specified=true");

        // Get all the purchaseQuotationList where lastModifiedBy is null
        defaultPurchaseQuotationShouldNotBeFound("lastModifiedBy.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedByContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModifiedBy contains DEFAULT_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldBeFound("lastModifiedBy.contains=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the purchaseQuotationList where lastModifiedBy contains UPDATED_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldNotBeFound("lastModifiedBy.contains=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByLastModifiedByNotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where lastModifiedBy does not contain DEFAULT_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldNotBeFound("lastModifiedBy.doesNotContain=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the purchaseQuotationList where lastModifiedBy does not contain UPDATED_LAST_MODIFIED_BY
        defaultPurchaseQuotationShouldBeFound("lastModifiedBy.doesNotContain=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField1IsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField1 equals to DEFAULT_FREE_FIELD_1
        defaultPurchaseQuotationShouldBeFound("freeField1.equals=" + DEFAULT_FREE_FIELD_1);

        // Get all the purchaseQuotationList where freeField1 equals to UPDATED_FREE_FIELD_1
        defaultPurchaseQuotationShouldNotBeFound("freeField1.equals=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField1IsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField1 in DEFAULT_FREE_FIELD_1 or UPDATED_FREE_FIELD_1
        defaultPurchaseQuotationShouldBeFound("freeField1.in=" + DEFAULT_FREE_FIELD_1 + "," + UPDATED_FREE_FIELD_1);

        // Get all the purchaseQuotationList where freeField1 equals to UPDATED_FREE_FIELD_1
        defaultPurchaseQuotationShouldNotBeFound("freeField1.in=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField1IsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField1 is not null
        defaultPurchaseQuotationShouldBeFound("freeField1.specified=true");

        // Get all the purchaseQuotationList where freeField1 is null
        defaultPurchaseQuotationShouldNotBeFound("freeField1.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField1ContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField1 contains DEFAULT_FREE_FIELD_1
        defaultPurchaseQuotationShouldBeFound("freeField1.contains=" + DEFAULT_FREE_FIELD_1);

        // Get all the purchaseQuotationList where freeField1 contains UPDATED_FREE_FIELD_1
        defaultPurchaseQuotationShouldNotBeFound("freeField1.contains=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField1NotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField1 does not contain DEFAULT_FREE_FIELD_1
        defaultPurchaseQuotationShouldNotBeFound("freeField1.doesNotContain=" + DEFAULT_FREE_FIELD_1);

        // Get all the purchaseQuotationList where freeField1 does not contain UPDATED_FREE_FIELD_1
        defaultPurchaseQuotationShouldBeFound("freeField1.doesNotContain=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField2IsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField2 equals to DEFAULT_FREE_FIELD_2
        defaultPurchaseQuotationShouldBeFound("freeField2.equals=" + DEFAULT_FREE_FIELD_2);

        // Get all the purchaseQuotationList where freeField2 equals to UPDATED_FREE_FIELD_2
        defaultPurchaseQuotationShouldNotBeFound("freeField2.equals=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField2IsInShouldWork() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField2 in DEFAULT_FREE_FIELD_2 or UPDATED_FREE_FIELD_2
        defaultPurchaseQuotationShouldBeFound("freeField2.in=" + DEFAULT_FREE_FIELD_2 + "," + UPDATED_FREE_FIELD_2);

        // Get all the purchaseQuotationList where freeField2 equals to UPDATED_FREE_FIELD_2
        defaultPurchaseQuotationShouldNotBeFound("freeField2.in=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField2IsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField2 is not null
        defaultPurchaseQuotationShouldBeFound("freeField2.specified=true");

        // Get all the purchaseQuotationList where freeField2 is null
        defaultPurchaseQuotationShouldNotBeFound("freeField2.specified=false");
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField2ContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField2 contains DEFAULT_FREE_FIELD_2
        defaultPurchaseQuotationShouldBeFound("freeField2.contains=" + DEFAULT_FREE_FIELD_2);

        // Get all the purchaseQuotationList where freeField2 contains UPDATED_FREE_FIELD_2
        defaultPurchaseQuotationShouldNotBeFound("freeField2.contains=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByFreeField2NotContainsSomething() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        // Get all the purchaseQuotationList where freeField2 does not contain DEFAULT_FREE_FIELD_2
        defaultPurchaseQuotationShouldNotBeFound("freeField2.doesNotContain=" + DEFAULT_FREE_FIELD_2);

        // Get all the purchaseQuotationList where freeField2 does not contain UPDATED_FREE_FIELD_2
        defaultPurchaseQuotationShouldBeFound("freeField2.doesNotContain=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByPurchaseQuotationDetailsIsEqualToSomething() throws Exception {
        PurchaseQuotationDetails purchaseQuotationDetails;
        if (TestUtil.findAll(em, PurchaseQuotationDetails.class).isEmpty()) {
            purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
            purchaseQuotationDetails = PurchaseQuotationDetailsResourceIT.createEntity(em);
        } else {
            purchaseQuotationDetails = TestUtil.findAll(em, PurchaseQuotationDetails.class).get(0);
        }
        em.persist(purchaseQuotationDetails);
        em.flush();
        purchaseQuotation.addPurchaseQuotationDetails(purchaseQuotationDetails);
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
        Long purchaseQuotationDetailsId = purchaseQuotationDetails.getId();

        // Get all the purchaseQuotationList where purchaseQuotationDetails equals to purchaseQuotationDetailsId
        defaultPurchaseQuotationShouldBeFound("purchaseQuotationDetailsId.equals=" + purchaseQuotationDetailsId);

        // Get all the purchaseQuotationList where purchaseQuotationDetails equals to (purchaseQuotationDetailsId + 1)
        defaultPurchaseQuotationShouldNotBeFound("purchaseQuotationDetailsId.equals=" + (purchaseQuotationDetailsId + 1));
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByGoodRecivedIsEqualToSomething() throws Exception {
        GoodsRecived goodRecived;
        if (TestUtil.findAll(em, GoodsRecived.class).isEmpty()) {
            purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
            goodRecived = GoodsRecivedResourceIT.createEntity(em);
        } else {
            goodRecived = TestUtil.findAll(em, GoodsRecived.class).get(0);
        }
        em.persist(goodRecived);
        em.flush();
        purchaseQuotation.addGoodRecived(goodRecived);
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
        Long goodRecivedId = goodRecived.getId();

        // Get all the purchaseQuotationList where goodRecived equals to goodRecivedId
        defaultPurchaseQuotationShouldBeFound("goodRecivedId.equals=" + goodRecivedId);

        // Get all the purchaseQuotationList where goodRecived equals to (goodRecivedId + 1)
        defaultPurchaseQuotationShouldNotBeFound("goodRecivedId.equals=" + (goodRecivedId + 1));
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsBySecurityUserIsEqualToSomething() throws Exception {
        SecurityUser securityUser;
        if (TestUtil.findAll(em, SecurityUser.class).isEmpty()) {
            purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
            securityUser = SecurityUserResourceIT.createEntity(em);
        } else {
            securityUser = TestUtil.findAll(em, SecurityUser.class).get(0);
        }
        em.persist(securityUser);
        em.flush();
        purchaseQuotation.setSecurityUser(securityUser);
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
        Long securityUserId = securityUser.getId();

        // Get all the purchaseQuotationList where securityUser equals to securityUserId
        defaultPurchaseQuotationShouldBeFound("securityUserId.equals=" + securityUserId);

        // Get all the purchaseQuotationList where securityUser equals to (securityUserId + 1)
        defaultPurchaseQuotationShouldNotBeFound("securityUserId.equals=" + (securityUserId + 1));
    }

    @Test
    @Transactional
    void getAllPurchaseQuotationsByProductInventoryIsEqualToSomething() throws Exception {
        ProductInventory productInventory;
        if (TestUtil.findAll(em, ProductInventory.class).isEmpty()) {
            purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
            productInventory = ProductInventoryResourceIT.createEntity(em);
        } else {
            productInventory = TestUtil.findAll(em, ProductInventory.class).get(0);
        }
        em.persist(productInventory);
        em.flush();
        purchaseQuotation.addProductInventory(productInventory);
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);
        Long productInventoryId = productInventory.getId();

        // Get all the purchaseQuotationList where productInventory equals to productInventoryId
        defaultPurchaseQuotationShouldBeFound("productInventoryId.equals=" + productInventoryId);

        // Get all the purchaseQuotationList where productInventory equals to (productInventoryId + 1)
        defaultPurchaseQuotationShouldNotBeFound("productInventoryId.equals=" + (productInventoryId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultPurchaseQuotationShouldBeFound(String filter) throws Exception {
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseQuotation.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalPOAmount").value(hasItem(DEFAULT_TOTAL_PO_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].totalGSTAmount").value(hasItem(DEFAULT_TOTAL_GST_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].expectedDeliveryDate").value(hasItem(DEFAULT_EXPECTED_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].poDate").value(hasItem(DEFAULT_PO_DATE.toString())))
            .andExpect(jsonPath("$.[*].orderType").value(hasItem(DEFAULT_ORDER_TYPE.toString())))
            .andExpect(jsonPath("$.[*].orderStatus").value(hasItem(DEFAULT_ORDER_STATUS.toString())))
            .andExpect(jsonPath("$.[*].clientName").value(hasItem(DEFAULT_CLIENT_NAME)))
            .andExpect(jsonPath("$.[*].clientMobile").value(hasItem(DEFAULT_CLIENT_MOBILE)))
            .andExpect(jsonPath("$.[*].clientEmail").value(hasItem(DEFAULT_CLIENT_EMAIL)))
            .andExpect(jsonPath("$.[*].termsAndCondition").value(hasItem(DEFAULT_TERMS_AND_CONDITION)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED)))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].freeField1").value(hasItem(DEFAULT_FREE_FIELD_1)))
            .andExpect(jsonPath("$.[*].freeField2").value(hasItem(DEFAULT_FREE_FIELD_2)));

        // Check, that the count call also returns 1
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultPurchaseQuotationShouldNotBeFound(String filter) throws Exception {
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPurchaseQuotationMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseQuotation() throws Exception {
        // Get the purchaseQuotation
        restPurchaseQuotationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseQuotation() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();

        // Update the purchaseQuotation
        PurchaseQuotation updatedPurchaseQuotation = purchaseQuotationRepository.findById(purchaseQuotation.getId()).get();
        // Disconnect from session so that the updates on updatedPurchaseQuotation are not directly saved in db
        em.detach(updatedPurchaseQuotation);
        updatedPurchaseQuotation
            .totalPOAmount(UPDATED_TOTAL_PO_AMOUNT)
            .totalGSTAmount(UPDATED_TOTAL_GST_AMOUNT)
            .expectedDeliveryDate(UPDATED_EXPECTED_DELIVERY_DATE)
            .poDate(UPDATED_PO_DATE)
            .orderType(UPDATED_ORDER_TYPE)
            .orderStatus(UPDATED_ORDER_STATUS)
            .clientName(UPDATED_CLIENT_NAME)
            .clientMobile(UPDATED_CLIENT_MOBILE)
            .clientEmail(UPDATED_CLIENT_EMAIL)
            .termsAndCondition(UPDATED_TERMS_AND_CONDITION)
            .notes(UPDATED_NOTES)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2);
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(updatedPurchaseQuotation);

        restPurchaseQuotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseQuotationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
        PurchaseQuotation testPurchaseQuotation = purchaseQuotationList.get(purchaseQuotationList.size() - 1);
        assertThat(testPurchaseQuotation.getTotalPOAmount()).isEqualTo(UPDATED_TOTAL_PO_AMOUNT);
        assertThat(testPurchaseQuotation.getTotalGSTAmount()).isEqualTo(UPDATED_TOTAL_GST_AMOUNT);
        assertThat(testPurchaseQuotation.getExpectedDeliveryDate()).isEqualTo(UPDATED_EXPECTED_DELIVERY_DATE);
        assertThat(testPurchaseQuotation.getPoDate()).isEqualTo(UPDATED_PO_DATE);
        assertThat(testPurchaseQuotation.getOrderType()).isEqualTo(UPDATED_ORDER_TYPE);
        assertThat(testPurchaseQuotation.getOrderStatus()).isEqualTo(UPDATED_ORDER_STATUS);
        assertThat(testPurchaseQuotation.getClientName()).isEqualTo(UPDATED_CLIENT_NAME);
        assertThat(testPurchaseQuotation.getClientMobile()).isEqualTo(UPDATED_CLIENT_MOBILE);
        assertThat(testPurchaseQuotation.getClientEmail()).isEqualTo(UPDATED_CLIENT_EMAIL);
        assertThat(testPurchaseQuotation.getTermsAndCondition()).isEqualTo(UPDATED_TERMS_AND_CONDITION);
        assertThat(testPurchaseQuotation.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testPurchaseQuotation.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testPurchaseQuotation.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testPurchaseQuotation.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testPurchaseQuotation.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseQuotationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseQuotationWithPatch() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();

        // Update the purchaseQuotation using partial update
        PurchaseQuotation partialUpdatedPurchaseQuotation = new PurchaseQuotation();
        partialUpdatedPurchaseQuotation.setId(purchaseQuotation.getId());

        partialUpdatedPurchaseQuotation
            .poDate(UPDATED_PO_DATE)
            .orderStatus(UPDATED_ORDER_STATUS)
            .clientMobile(UPDATED_CLIENT_MOBILE)
            .clientEmail(UPDATED_CLIENT_EMAIL)
            .notes(UPDATED_NOTES)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2);

        restPurchaseQuotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseQuotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseQuotation))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
        PurchaseQuotation testPurchaseQuotation = purchaseQuotationList.get(purchaseQuotationList.size() - 1);
        assertThat(testPurchaseQuotation.getTotalPOAmount()).isEqualTo(DEFAULT_TOTAL_PO_AMOUNT);
        assertThat(testPurchaseQuotation.getTotalGSTAmount()).isEqualTo(DEFAULT_TOTAL_GST_AMOUNT);
        assertThat(testPurchaseQuotation.getExpectedDeliveryDate()).isEqualTo(DEFAULT_EXPECTED_DELIVERY_DATE);
        assertThat(testPurchaseQuotation.getPoDate()).isEqualTo(UPDATED_PO_DATE);
        assertThat(testPurchaseQuotation.getOrderType()).isEqualTo(DEFAULT_ORDER_TYPE);
        assertThat(testPurchaseQuotation.getOrderStatus()).isEqualTo(UPDATED_ORDER_STATUS);
        assertThat(testPurchaseQuotation.getClientName()).isEqualTo(DEFAULT_CLIENT_NAME);
        assertThat(testPurchaseQuotation.getClientMobile()).isEqualTo(UPDATED_CLIENT_MOBILE);
        assertThat(testPurchaseQuotation.getClientEmail()).isEqualTo(UPDATED_CLIENT_EMAIL);
        assertThat(testPurchaseQuotation.getTermsAndCondition()).isEqualTo(DEFAULT_TERMS_AND_CONDITION);
        assertThat(testPurchaseQuotation.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testPurchaseQuotation.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testPurchaseQuotation.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testPurchaseQuotation.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testPurchaseQuotation.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void fullUpdatePurchaseQuotationWithPatch() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();

        // Update the purchaseQuotation using partial update
        PurchaseQuotation partialUpdatedPurchaseQuotation = new PurchaseQuotation();
        partialUpdatedPurchaseQuotation.setId(purchaseQuotation.getId());

        partialUpdatedPurchaseQuotation
            .totalPOAmount(UPDATED_TOTAL_PO_AMOUNT)
            .totalGSTAmount(UPDATED_TOTAL_GST_AMOUNT)
            .expectedDeliveryDate(UPDATED_EXPECTED_DELIVERY_DATE)
            .poDate(UPDATED_PO_DATE)
            .orderType(UPDATED_ORDER_TYPE)
            .orderStatus(UPDATED_ORDER_STATUS)
            .clientName(UPDATED_CLIENT_NAME)
            .clientMobile(UPDATED_CLIENT_MOBILE)
            .clientEmail(UPDATED_CLIENT_EMAIL)
            .termsAndCondition(UPDATED_TERMS_AND_CONDITION)
            .notes(UPDATED_NOTES)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2);

        restPurchaseQuotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseQuotation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseQuotation))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
        PurchaseQuotation testPurchaseQuotation = purchaseQuotationList.get(purchaseQuotationList.size() - 1);
        assertThat(testPurchaseQuotation.getTotalPOAmount()).isEqualTo(UPDATED_TOTAL_PO_AMOUNT);
        assertThat(testPurchaseQuotation.getTotalGSTAmount()).isEqualTo(UPDATED_TOTAL_GST_AMOUNT);
        assertThat(testPurchaseQuotation.getExpectedDeliveryDate()).isEqualTo(UPDATED_EXPECTED_DELIVERY_DATE);
        assertThat(testPurchaseQuotation.getPoDate()).isEqualTo(UPDATED_PO_DATE);
        assertThat(testPurchaseQuotation.getOrderType()).isEqualTo(UPDATED_ORDER_TYPE);
        assertThat(testPurchaseQuotation.getOrderStatus()).isEqualTo(UPDATED_ORDER_STATUS);
        assertThat(testPurchaseQuotation.getClientName()).isEqualTo(UPDATED_CLIENT_NAME);
        assertThat(testPurchaseQuotation.getClientMobile()).isEqualTo(UPDATED_CLIENT_MOBILE);
        assertThat(testPurchaseQuotation.getClientEmail()).isEqualTo(UPDATED_CLIENT_EMAIL);
        assertThat(testPurchaseQuotation.getTermsAndCondition()).isEqualTo(UPDATED_TERMS_AND_CONDITION);
        assertThat(testPurchaseQuotation.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testPurchaseQuotation.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testPurchaseQuotation.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testPurchaseQuotation.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testPurchaseQuotation.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseQuotationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseQuotation() throws Exception {
        int databaseSizeBeforeUpdate = purchaseQuotationRepository.findAll().size();
        purchaseQuotation.setId(count.incrementAndGet());

        // Create the PurchaseQuotation
        PurchaseQuotationDTO purchaseQuotationDTO = purchaseQuotationMapper.toDto(purchaseQuotation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseQuotationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseQuotationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseQuotation in the database
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseQuotation() throws Exception {
        // Initialize the database
        purchaseQuotationRepository.saveAndFlush(purchaseQuotation);

        int databaseSizeBeforeDelete = purchaseQuotationRepository.findAll().size();

        // Delete the purchaseQuotation
        restPurchaseQuotationMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseQuotation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PurchaseQuotation> purchaseQuotationList = purchaseQuotationRepository.findAll();
        assertThat(purchaseQuotationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
