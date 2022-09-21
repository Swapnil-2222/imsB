package com.techvg.ims.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techvg.ims.IntegrationTest;
import com.techvg.ims.domain.Notification;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.domain.enumeration.NotificationType;
import com.techvg.ims.repository.NotificationRepository;
import com.techvg.ims.service.NotificationService;
import com.techvg.ims.service.criteria.NotificationCriteria;
import com.techvg.ims.service.dto.NotificationDTO;
import com.techvg.ims.service.mapper.NotificationMapper;
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
 * Integration tests for the {@link NotificationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class NotificationResourceIT {

    private static final String DEFAULT_MASSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MASSAGE = "BBBBBBBBBB";

    private static final NotificationType DEFAULT_NOTIFICATION_TYPE = NotificationType.APPROVAL;
    private static final NotificationType UPDATED_NOTIFICATION_TYPE = NotificationType.REQUEST;

    private static final Boolean DEFAULT_IS_ACTION_REQUIRED = false;
    private static final Boolean UPDATED_IS_ACTION_REQUIRED = true;

    private static final String DEFAULT_FREE_FIELD_1 = "AAAAAAAAAA";
    private static final String UPDATED_FREE_FIELD_1 = "BBBBBBBBBB";

    private static final String DEFAULT_FREE_FIELD_2 = "AAAAAAAAAA";
    private static final String UPDATED_FREE_FIELD_2 = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_MODIFIED = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/notifications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NotificationRepository notificationRepository;

    @Mock
    private NotificationRepository notificationRepositoryMock;

    @Autowired
    private NotificationMapper notificationMapper;

    @Mock
    private NotificationService notificationServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNotificationMockMvc;

    private Notification notification;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notification createEntity(EntityManager em) {
        Notification notification = new Notification()
            .massage(DEFAULT_MASSAGE)
            .notificationType(DEFAULT_NOTIFICATION_TYPE)
            .isActionRequired(DEFAULT_IS_ACTION_REQUIRED)
            .freeField1(DEFAULT_FREE_FIELD_1)
            .freeField2(DEFAULT_FREE_FIELD_2)
            .lastModified(DEFAULT_LAST_MODIFIED)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY);
        return notification;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notification createUpdatedEntity(EntityManager em) {
        Notification notification = new Notification()
            .massage(UPDATED_MASSAGE)
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .isActionRequired(UPDATED_IS_ACTION_REQUIRED)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);
        return notification;
    }

    @BeforeEach
    public void initTest() {
        notification = createEntity(em);
    }

    @Test
    @Transactional
    void createNotification() throws Exception {
        int databaseSizeBeforeCreate = notificationRepository.findAll().size();
        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);
        restNotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeCreate + 1);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getMassage()).isEqualTo(DEFAULT_MASSAGE);
        assertThat(testNotification.getNotificationType()).isEqualTo(DEFAULT_NOTIFICATION_TYPE);
        assertThat(testNotification.getIsActionRequired()).isEqualTo(DEFAULT_IS_ACTION_REQUIRED);
        assertThat(testNotification.getFreeField1()).isEqualTo(DEFAULT_FREE_FIELD_1);
        assertThat(testNotification.getFreeField2()).isEqualTo(DEFAULT_FREE_FIELD_2);
        assertThat(testNotification.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
        assertThat(testNotification.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void createNotificationWithExistingId() throws Exception {
        // Create the Notification with an existing ID
        notification.setId(1L);
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        int databaseSizeBeforeCreate = notificationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMassageIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().size();
        // set the field null
        notification.setMassage(null);

        // Create the Notification, which fails.
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        restNotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastModifiedIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().size();
        // set the field null
        notification.setLastModified(null);

        // Create the Notification, which fails.
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        restNotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastModifiedByIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().size();
        // set the field null
        notification.setLastModifiedBy(null);

        // Create the Notification, which fails.
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        restNotificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllNotifications() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(notification.getId().intValue())))
            .andExpect(jsonPath("$.[*].massage").value(hasItem(DEFAULT_MASSAGE)))
            .andExpect(jsonPath("$.[*].notificationType").value(hasItem(DEFAULT_NOTIFICATION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].isActionRequired").value(hasItem(DEFAULT_IS_ACTION_REQUIRED.booleanValue())))
            .andExpect(jsonPath("$.[*].freeField1").value(hasItem(DEFAULT_FREE_FIELD_1)))
            .andExpect(jsonPath("$.[*].freeField2").value(hasItem(DEFAULT_FREE_FIELD_2)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED)))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllNotificationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(notificationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restNotificationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(notificationServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllNotificationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(notificationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restNotificationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(notificationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get the notification
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL_ID, notification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(notification.getId().intValue()))
            .andExpect(jsonPath("$.massage").value(DEFAULT_MASSAGE))
            .andExpect(jsonPath("$.notificationType").value(DEFAULT_NOTIFICATION_TYPE.toString()))
            .andExpect(jsonPath("$.isActionRequired").value(DEFAULT_IS_ACTION_REQUIRED.booleanValue()))
            .andExpect(jsonPath("$.freeField1").value(DEFAULT_FREE_FIELD_1))
            .andExpect(jsonPath("$.freeField2").value(DEFAULT_FREE_FIELD_2))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY));
    }

    @Test
    @Transactional
    void getNotificationsByIdFiltering() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        Long id = notification.getId();

        defaultNotificationShouldBeFound("id.equals=" + id);
        defaultNotificationShouldNotBeFound("id.notEquals=" + id);

        defaultNotificationShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultNotificationShouldNotBeFound("id.greaterThan=" + id);

        defaultNotificationShouldBeFound("id.lessThanOrEqual=" + id);
        defaultNotificationShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllNotificationsByMassageIsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where massage equals to DEFAULT_MASSAGE
        defaultNotificationShouldBeFound("massage.equals=" + DEFAULT_MASSAGE);

        // Get all the notificationList where massage equals to UPDATED_MASSAGE
        defaultNotificationShouldNotBeFound("massage.equals=" + UPDATED_MASSAGE);
    }

    @Test
    @Transactional
    void getAllNotificationsByMassageIsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where massage in DEFAULT_MASSAGE or UPDATED_MASSAGE
        defaultNotificationShouldBeFound("massage.in=" + DEFAULT_MASSAGE + "," + UPDATED_MASSAGE);

        // Get all the notificationList where massage equals to UPDATED_MASSAGE
        defaultNotificationShouldNotBeFound("massage.in=" + UPDATED_MASSAGE);
    }

    @Test
    @Transactional
    void getAllNotificationsByMassageIsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where massage is not null
        defaultNotificationShouldBeFound("massage.specified=true");

        // Get all the notificationList where massage is null
        defaultNotificationShouldNotBeFound("massage.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByMassageContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where massage contains DEFAULT_MASSAGE
        defaultNotificationShouldBeFound("massage.contains=" + DEFAULT_MASSAGE);

        // Get all the notificationList where massage contains UPDATED_MASSAGE
        defaultNotificationShouldNotBeFound("massage.contains=" + UPDATED_MASSAGE);
    }

    @Test
    @Transactional
    void getAllNotificationsByMassageNotContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where massage does not contain DEFAULT_MASSAGE
        defaultNotificationShouldNotBeFound("massage.doesNotContain=" + DEFAULT_MASSAGE);

        // Get all the notificationList where massage does not contain UPDATED_MASSAGE
        defaultNotificationShouldBeFound("massage.doesNotContain=" + UPDATED_MASSAGE);
    }

    @Test
    @Transactional
    void getAllNotificationsByNotificationTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where notificationType equals to DEFAULT_NOTIFICATION_TYPE
        defaultNotificationShouldBeFound("notificationType.equals=" + DEFAULT_NOTIFICATION_TYPE);

        // Get all the notificationList where notificationType equals to UPDATED_NOTIFICATION_TYPE
        defaultNotificationShouldNotBeFound("notificationType.equals=" + UPDATED_NOTIFICATION_TYPE);
    }

    @Test
    @Transactional
    void getAllNotificationsByNotificationTypeIsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where notificationType in DEFAULT_NOTIFICATION_TYPE or UPDATED_NOTIFICATION_TYPE
        defaultNotificationShouldBeFound("notificationType.in=" + DEFAULT_NOTIFICATION_TYPE + "," + UPDATED_NOTIFICATION_TYPE);

        // Get all the notificationList where notificationType equals to UPDATED_NOTIFICATION_TYPE
        defaultNotificationShouldNotBeFound("notificationType.in=" + UPDATED_NOTIFICATION_TYPE);
    }

    @Test
    @Transactional
    void getAllNotificationsByNotificationTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where notificationType is not null
        defaultNotificationShouldBeFound("notificationType.specified=true");

        // Get all the notificationList where notificationType is null
        defaultNotificationShouldNotBeFound("notificationType.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByIsActionRequiredIsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where isActionRequired equals to DEFAULT_IS_ACTION_REQUIRED
        defaultNotificationShouldBeFound("isActionRequired.equals=" + DEFAULT_IS_ACTION_REQUIRED);

        // Get all the notificationList where isActionRequired equals to UPDATED_IS_ACTION_REQUIRED
        defaultNotificationShouldNotBeFound("isActionRequired.equals=" + UPDATED_IS_ACTION_REQUIRED);
    }

    @Test
    @Transactional
    void getAllNotificationsByIsActionRequiredIsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where isActionRequired in DEFAULT_IS_ACTION_REQUIRED or UPDATED_IS_ACTION_REQUIRED
        defaultNotificationShouldBeFound("isActionRequired.in=" + DEFAULT_IS_ACTION_REQUIRED + "," + UPDATED_IS_ACTION_REQUIRED);

        // Get all the notificationList where isActionRequired equals to UPDATED_IS_ACTION_REQUIRED
        defaultNotificationShouldNotBeFound("isActionRequired.in=" + UPDATED_IS_ACTION_REQUIRED);
    }

    @Test
    @Transactional
    void getAllNotificationsByIsActionRequiredIsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where isActionRequired is not null
        defaultNotificationShouldBeFound("isActionRequired.specified=true");

        // Get all the notificationList where isActionRequired is null
        defaultNotificationShouldNotBeFound("isActionRequired.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField1IsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField1 equals to DEFAULT_FREE_FIELD_1
        defaultNotificationShouldBeFound("freeField1.equals=" + DEFAULT_FREE_FIELD_1);

        // Get all the notificationList where freeField1 equals to UPDATED_FREE_FIELD_1
        defaultNotificationShouldNotBeFound("freeField1.equals=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField1IsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField1 in DEFAULT_FREE_FIELD_1 or UPDATED_FREE_FIELD_1
        defaultNotificationShouldBeFound("freeField1.in=" + DEFAULT_FREE_FIELD_1 + "," + UPDATED_FREE_FIELD_1);

        // Get all the notificationList where freeField1 equals to UPDATED_FREE_FIELD_1
        defaultNotificationShouldNotBeFound("freeField1.in=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField1IsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField1 is not null
        defaultNotificationShouldBeFound("freeField1.specified=true");

        // Get all the notificationList where freeField1 is null
        defaultNotificationShouldNotBeFound("freeField1.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField1ContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField1 contains DEFAULT_FREE_FIELD_1
        defaultNotificationShouldBeFound("freeField1.contains=" + DEFAULT_FREE_FIELD_1);

        // Get all the notificationList where freeField1 contains UPDATED_FREE_FIELD_1
        defaultNotificationShouldNotBeFound("freeField1.contains=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField1NotContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField1 does not contain DEFAULT_FREE_FIELD_1
        defaultNotificationShouldNotBeFound("freeField1.doesNotContain=" + DEFAULT_FREE_FIELD_1);

        // Get all the notificationList where freeField1 does not contain UPDATED_FREE_FIELD_1
        defaultNotificationShouldBeFound("freeField1.doesNotContain=" + UPDATED_FREE_FIELD_1);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField2IsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField2 equals to DEFAULT_FREE_FIELD_2
        defaultNotificationShouldBeFound("freeField2.equals=" + DEFAULT_FREE_FIELD_2);

        // Get all the notificationList where freeField2 equals to UPDATED_FREE_FIELD_2
        defaultNotificationShouldNotBeFound("freeField2.equals=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField2IsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField2 in DEFAULT_FREE_FIELD_2 or UPDATED_FREE_FIELD_2
        defaultNotificationShouldBeFound("freeField2.in=" + DEFAULT_FREE_FIELD_2 + "," + UPDATED_FREE_FIELD_2);

        // Get all the notificationList where freeField2 equals to UPDATED_FREE_FIELD_2
        defaultNotificationShouldNotBeFound("freeField2.in=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField2IsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField2 is not null
        defaultNotificationShouldBeFound("freeField2.specified=true");

        // Get all the notificationList where freeField2 is null
        defaultNotificationShouldNotBeFound("freeField2.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField2ContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField2 contains DEFAULT_FREE_FIELD_2
        defaultNotificationShouldBeFound("freeField2.contains=" + DEFAULT_FREE_FIELD_2);

        // Get all the notificationList where freeField2 contains UPDATED_FREE_FIELD_2
        defaultNotificationShouldNotBeFound("freeField2.contains=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllNotificationsByFreeField2NotContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where freeField2 does not contain DEFAULT_FREE_FIELD_2
        defaultNotificationShouldNotBeFound("freeField2.doesNotContain=" + DEFAULT_FREE_FIELD_2);

        // Get all the notificationList where freeField2 does not contain UPDATED_FREE_FIELD_2
        defaultNotificationShouldBeFound("freeField2.doesNotContain=" + UPDATED_FREE_FIELD_2);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedIsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModified equals to DEFAULT_LAST_MODIFIED
        defaultNotificationShouldBeFound("lastModified.equals=" + DEFAULT_LAST_MODIFIED);

        // Get all the notificationList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultNotificationShouldNotBeFound("lastModified.equals=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedIsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModified in DEFAULT_LAST_MODIFIED or UPDATED_LAST_MODIFIED
        defaultNotificationShouldBeFound("lastModified.in=" + DEFAULT_LAST_MODIFIED + "," + UPDATED_LAST_MODIFIED);

        // Get all the notificationList where lastModified equals to UPDATED_LAST_MODIFIED
        defaultNotificationShouldNotBeFound("lastModified.in=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedIsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModified is not null
        defaultNotificationShouldBeFound("lastModified.specified=true");

        // Get all the notificationList where lastModified is null
        defaultNotificationShouldNotBeFound("lastModified.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModified contains DEFAULT_LAST_MODIFIED
        defaultNotificationShouldBeFound("lastModified.contains=" + DEFAULT_LAST_MODIFIED);

        // Get all the notificationList where lastModified contains UPDATED_LAST_MODIFIED
        defaultNotificationShouldNotBeFound("lastModified.contains=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedNotContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModified does not contain DEFAULT_LAST_MODIFIED
        defaultNotificationShouldNotBeFound("lastModified.doesNotContain=" + DEFAULT_LAST_MODIFIED);

        // Get all the notificationList where lastModified does not contain UPDATED_LAST_MODIFIED
        defaultNotificationShouldBeFound("lastModified.doesNotContain=" + UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedByIsEqualToSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModifiedBy equals to DEFAULT_LAST_MODIFIED_BY
        defaultNotificationShouldBeFound("lastModifiedBy.equals=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the notificationList where lastModifiedBy equals to UPDATED_LAST_MODIFIED_BY
        defaultNotificationShouldNotBeFound("lastModifiedBy.equals=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedByIsInShouldWork() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModifiedBy in DEFAULT_LAST_MODIFIED_BY or UPDATED_LAST_MODIFIED_BY
        defaultNotificationShouldBeFound("lastModifiedBy.in=" + DEFAULT_LAST_MODIFIED_BY + "," + UPDATED_LAST_MODIFIED_BY);

        // Get all the notificationList where lastModifiedBy equals to UPDATED_LAST_MODIFIED_BY
        defaultNotificationShouldNotBeFound("lastModifiedBy.in=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedByIsNullOrNotNull() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModifiedBy is not null
        defaultNotificationShouldBeFound("lastModifiedBy.specified=true");

        // Get all the notificationList where lastModifiedBy is null
        defaultNotificationShouldNotBeFound("lastModifiedBy.specified=false");
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedByContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModifiedBy contains DEFAULT_LAST_MODIFIED_BY
        defaultNotificationShouldBeFound("lastModifiedBy.contains=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the notificationList where lastModifiedBy contains UPDATED_LAST_MODIFIED_BY
        defaultNotificationShouldNotBeFound("lastModifiedBy.contains=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllNotificationsByLastModifiedByNotContainsSomething() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notificationList where lastModifiedBy does not contain DEFAULT_LAST_MODIFIED_BY
        defaultNotificationShouldNotBeFound("lastModifiedBy.doesNotContain=" + DEFAULT_LAST_MODIFIED_BY);

        // Get all the notificationList where lastModifiedBy does not contain UPDATED_LAST_MODIFIED_BY
        defaultNotificationShouldBeFound("lastModifiedBy.doesNotContain=" + UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void getAllNotificationsBySecurityUserIsEqualToSomething() throws Exception {
        SecurityUser securityUser;
        if (TestUtil.findAll(em, SecurityUser.class).isEmpty()) {
            notificationRepository.saveAndFlush(notification);
            securityUser = SecurityUserResourceIT.createEntity(em);
        } else {
            securityUser = TestUtil.findAll(em, SecurityUser.class).get(0);
        }
        em.persist(securityUser);
        em.flush();
        notification.setSecurityUser(securityUser);
        notificationRepository.saveAndFlush(notification);
        Long securityUserId = securityUser.getId();

        // Get all the notificationList where securityUser equals to securityUserId
        defaultNotificationShouldBeFound("securityUserId.equals=" + securityUserId);

        // Get all the notificationList where securityUser equals to (securityUserId + 1)
        defaultNotificationShouldNotBeFound("securityUserId.equals=" + (securityUserId + 1));
    }

    @Test
    @Transactional
    void getAllNotificationsByWareHouseIsEqualToSomething() throws Exception {
        WareHouse wareHouse;
        if (TestUtil.findAll(em, WareHouse.class).isEmpty()) {
            notificationRepository.saveAndFlush(notification);
            wareHouse = WareHouseResourceIT.createEntity(em);
        } else {
            wareHouse = TestUtil.findAll(em, WareHouse.class).get(0);
        }
        em.persist(wareHouse);
        em.flush();
        notification.setWareHouse(wareHouse);
        notificationRepository.saveAndFlush(notification);
        Long wareHouseId = wareHouse.getId();

        // Get all the notificationList where wareHouse equals to wareHouseId
        defaultNotificationShouldBeFound("wareHouseId.equals=" + wareHouseId);

        // Get all the notificationList where wareHouse equals to (wareHouseId + 1)
        defaultNotificationShouldNotBeFound("wareHouseId.equals=" + (wareHouseId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultNotificationShouldBeFound(String filter) throws Exception {
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(notification.getId().intValue())))
            .andExpect(jsonPath("$.[*].massage").value(hasItem(DEFAULT_MASSAGE)))
            .andExpect(jsonPath("$.[*].notificationType").value(hasItem(DEFAULT_NOTIFICATION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].isActionRequired").value(hasItem(DEFAULT_IS_ACTION_REQUIRED.booleanValue())))
            .andExpect(jsonPath("$.[*].freeField1").value(hasItem(DEFAULT_FREE_FIELD_1)))
            .andExpect(jsonPath("$.[*].freeField2").value(hasItem(DEFAULT_FREE_FIELD_2)))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED)))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)));

        // Check, that the count call also returns 1
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultNotificationShouldNotBeFound(String filter) throws Exception {
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restNotificationMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingNotification() throws Exception {
        // Get the notification
        restNotificationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();

        // Update the notification
        Notification updatedNotification = notificationRepository.findById(notification.getId()).get();
        // Disconnect from session so that the updates on updatedNotification are not directly saved in db
        em.detach(updatedNotification);
        updatedNotification
            .massage(UPDATED_MASSAGE)
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .isActionRequired(UPDATED_IS_ACTION_REQUIRED)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);
        NotificationDTO notificationDTO = notificationMapper.toDto(updatedNotification);

        restNotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, notificationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isOk());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getMassage()).isEqualTo(UPDATED_MASSAGE);
        assertThat(testNotification.getNotificationType()).isEqualTo(UPDATED_NOTIFICATION_TYPE);
        assertThat(testNotification.getIsActionRequired()).isEqualTo(UPDATED_IS_ACTION_REQUIRED);
        assertThat(testNotification.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testNotification.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
        assertThat(testNotification.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testNotification.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void putNonExistingNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, notificationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNotificationWithPatch() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();

        // Update the notification using partial update
        Notification partialUpdatedNotification = new Notification();
        partialUpdatedNotification.setId(notification.getId());

        partialUpdatedNotification
            .isActionRequired(UPDATED_IS_ACTION_REQUIRED)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restNotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotification))
            )
            .andExpect(status().isOk());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getMassage()).isEqualTo(DEFAULT_MASSAGE);
        assertThat(testNotification.getNotificationType()).isEqualTo(DEFAULT_NOTIFICATION_TYPE);
        assertThat(testNotification.getIsActionRequired()).isEqualTo(UPDATED_IS_ACTION_REQUIRED);
        assertThat(testNotification.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testNotification.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
        assertThat(testNotification.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testNotification.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void fullUpdateNotificationWithPatch() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();

        // Update the notification using partial update
        Notification partialUpdatedNotification = new Notification();
        partialUpdatedNotification.setId(notification.getId());

        partialUpdatedNotification
            .massage(UPDATED_MASSAGE)
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .isActionRequired(UPDATED_IS_ACTION_REQUIRED)
            .freeField1(UPDATED_FREE_FIELD_1)
            .freeField2(UPDATED_FREE_FIELD_2)
            .lastModified(UPDATED_LAST_MODIFIED)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restNotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotification))
            )
            .andExpect(status().isOk());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getMassage()).isEqualTo(UPDATED_MASSAGE);
        assertThat(testNotification.getNotificationType()).isEqualTo(UPDATED_NOTIFICATION_TYPE);
        assertThat(testNotification.getIsActionRequired()).isEqualTo(UPDATED_IS_ACTION_REQUIRED);
        assertThat(testNotification.getFreeField1()).isEqualTo(UPDATED_FREE_FIELD_1);
        assertThat(testNotification.getFreeField2()).isEqualTo(UPDATED_FREE_FIELD_2);
        assertThat(testNotification.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
        assertThat(testNotification.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
    }

    @Test
    @Transactional
    void patchNonExistingNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, notificationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().size();
        notification.setId(count.incrementAndGet());

        // Create the Notification
        NotificationDTO notificationDTO = notificationMapper.toDto(notification);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(notificationDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        int databaseSizeBeforeDelete = notificationRepository.findAll().size();

        // Delete the notification
        restNotificationMockMvc
            .perform(delete(ENTITY_API_URL_ID, notification.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Notification> notificationList = notificationRepository.findAll();
        assertThat(notificationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
