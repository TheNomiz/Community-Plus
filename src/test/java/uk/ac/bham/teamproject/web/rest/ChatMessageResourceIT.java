package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
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
import uk.ac.bham.teamproject.domain.ChatMessage;
import uk.ac.bham.teamproject.repository.ChatMessageRepository;

/**
 * Integration tests for the {@link ChatMessageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChatMessageResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/chat-messages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChatMessageMockMvc;

    private ChatMessage chatMessage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatMessage createEntity(EntityManager em) {
        ChatMessage chatMessage = new ChatMessage().content(DEFAULT_CONTENT).sentDate(DEFAULT_SENT_DATE);
        return chatMessage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatMessage createUpdatedEntity(EntityManager em) {
        ChatMessage chatMessage = new ChatMessage().content(UPDATED_CONTENT).sentDate(UPDATED_SENT_DATE);
        return chatMessage;
    }

    @BeforeEach
    public void initTest() {
        chatMessage = createEntity(em);
    }

    @Test
    @Transactional
    void createChatMessage() throws Exception {
        int databaseSizeBeforeCreate = chatMessageRepository.findAll().size();
        // Create the ChatMessage
        restChatMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatMessage)))
            .andExpect(status().isCreated());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeCreate + 1);
        ChatMessage testChatMessage = chatMessageList.get(chatMessageList.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testChatMessage.getSentDate()).isEqualTo(DEFAULT_SENT_DATE);
    }

    @Test
    @Transactional
    void createChatMessageWithExistingId() throws Exception {
        // Create the ChatMessage with an existing ID
        chatMessage.setId(1L);

        int databaseSizeBeforeCreate = chatMessageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatMessage)))
            .andExpect(status().isBadRequest());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = chatMessageRepository.findAll().size();
        // set the field null
        chatMessage.setContent(null);

        // Create the ChatMessage, which fails.

        restChatMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatMessage)))
            .andExpect(status().isBadRequest());

        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSentDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = chatMessageRepository.findAll().size();
        // set the field null
        chatMessage.setSentDate(null);

        // Create the ChatMessage, which fails.

        restChatMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatMessage)))
            .andExpect(status().isBadRequest());

        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChatMessages() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        // Get all the chatMessageList
        restChatMessageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatMessage.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].sentDate").value(hasItem(DEFAULT_SENT_DATE.toString())));
    }

    @Test
    @Transactional
    void getChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        // Get the chatMessage
        restChatMessageMockMvc
            .perform(get(ENTITY_API_URL_ID, chatMessage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chatMessage.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.sentDate").value(DEFAULT_SENT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingChatMessage() throws Exception {
        // Get the chatMessage
        restChatMessageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();

        // Update the chatMessage
        ChatMessage updatedChatMessage = chatMessageRepository.findById(chatMessage.getId()).get();
        // Disconnect from session so that the updates on updatedChatMessage are not directly saved in db
        em.detach(updatedChatMessage);
        updatedChatMessage.content(UPDATED_CONTENT).sentDate(UPDATED_SENT_DATE);

        restChatMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChatMessage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChatMessage))
            )
            .andExpect(status().isOk());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
        ChatMessage testChatMessage = chatMessageList.get(chatMessageList.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testChatMessage.getSentDate()).isEqualTo(UPDATED_SENT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chatMessage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatMessage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatMessage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatMessage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChatMessageWithPatch() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();

        // Update the chatMessage using partial update
        ChatMessage partialUpdatedChatMessage = new ChatMessage();
        partialUpdatedChatMessage.setId(chatMessage.getId());

        partialUpdatedChatMessage.sentDate(UPDATED_SENT_DATE);

        restChatMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatMessage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatMessage))
            )
            .andExpect(status().isOk());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
        ChatMessage testChatMessage = chatMessageList.get(chatMessageList.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testChatMessage.getSentDate()).isEqualTo(UPDATED_SENT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateChatMessageWithPatch() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();

        // Update the chatMessage using partial update
        ChatMessage partialUpdatedChatMessage = new ChatMessage();
        partialUpdatedChatMessage.setId(chatMessage.getId());

        partialUpdatedChatMessage.content(UPDATED_CONTENT).sentDate(UPDATED_SENT_DATE);

        restChatMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatMessage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatMessage))
            )
            .andExpect(status().isOk());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
        ChatMessage testChatMessage = chatMessageList.get(chatMessageList.size() - 1);
        assertThat(testChatMessage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testChatMessage.getSentDate()).isEqualTo(UPDATED_SENT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chatMessage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatMessage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatMessage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChatMessage() throws Exception {
        int databaseSizeBeforeUpdate = chatMessageRepository.findAll().size();
        chatMessage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatMessageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chatMessage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatMessage in the database
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChatMessage() throws Exception {
        // Initialize the database
        chatMessageRepository.saveAndFlush(chatMessage);

        int databaseSizeBeforeDelete = chatMessageRepository.findAll().size();

        // Delete the chatMessage
        restChatMessageMockMvc
            .perform(delete(ENTITY_API_URL_ID, chatMessage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChatMessage> chatMessageList = chatMessageRepository.findAll();
        assertThat(chatMessageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
