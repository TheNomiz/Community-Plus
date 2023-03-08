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
import uk.ac.bham.teamproject.domain.ChatRoom;
import uk.ac.bham.teamproject.repository.ChatRoomRepository;

/**
 * Integration tests for the {@link ChatRoomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChatRoomResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chat-rooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChatRoomMockMvc;

    private ChatRoom chatRoom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatRoom createEntity(EntityManager em) {
        ChatRoom chatRoom = new ChatRoom().name(DEFAULT_NAME);
        return chatRoom;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatRoom createUpdatedEntity(EntityManager em) {
        ChatRoom chatRoom = new ChatRoom().name(UPDATED_NAME);
        return chatRoom;
    }

    @BeforeEach
    public void initTest() {
        chatRoom = createEntity(em);
    }

    @Test
    @Transactional
    void createChatRoom() throws Exception {
        int databaseSizeBeforeCreate = chatRoomRepository.findAll().size();
        // Create the ChatRoom
        restChatRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatRoom)))
            .andExpect(status().isCreated());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeCreate + 1);
        ChatRoom testChatRoom = chatRoomList.get(chatRoomList.size() - 1);
        assertThat(testChatRoom.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createChatRoomWithExistingId() throws Exception {
        // Create the ChatRoom with an existing ID
        chatRoom.setId(1L);

        int databaseSizeBeforeCreate = chatRoomRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatRoom)))
            .andExpect(status().isBadRequest());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = chatRoomRepository.findAll().size();
        // set the field null
        chatRoom.setName(null);

        // Create the ChatRoom, which fails.

        restChatRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatRoom)))
            .andExpect(status().isBadRequest());

        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChatRooms() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        // Get all the chatRoomList
        restChatRoomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatRoom.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getChatRoom() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        // Get the chatRoom
        restChatRoomMockMvc
            .perform(get(ENTITY_API_URL_ID, chatRoom.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chatRoom.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingChatRoom() throws Exception {
        // Get the chatRoom
        restChatRoomMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChatRoom() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();

        // Update the chatRoom
        ChatRoom updatedChatRoom = chatRoomRepository.findById(chatRoom.getId()).get();
        // Disconnect from session so that the updates on updatedChatRoom are not directly saved in db
        em.detach(updatedChatRoom);
        updatedChatRoom.name(UPDATED_NAME);

        restChatRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChatRoom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChatRoom))
            )
            .andExpect(status().isOk());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
        ChatRoom testChatRoom = chatRoomList.get(chatRoomList.size() - 1);
        assertThat(testChatRoom.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chatRoom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatRoom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChatRoomWithPatch() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();

        // Update the chatRoom using partial update
        ChatRoom partialUpdatedChatRoom = new ChatRoom();
        partialUpdatedChatRoom.setId(chatRoom.getId());

        restChatRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatRoom))
            )
            .andExpect(status().isOk());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
        ChatRoom testChatRoom = chatRoomList.get(chatRoomList.size() - 1);
        assertThat(testChatRoom.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateChatRoomWithPatch() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();

        // Update the chatRoom using partial update
        ChatRoom partialUpdatedChatRoom = new ChatRoom();
        partialUpdatedChatRoom.setId(chatRoom.getId());

        partialUpdatedChatRoom.name(UPDATED_NAME);

        restChatRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatRoom))
            )
            .andExpect(status().isOk());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
        ChatRoom testChatRoom = chatRoomList.get(chatRoomList.size() - 1);
        assertThat(testChatRoom.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chatRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChatRoom() throws Exception {
        int databaseSizeBeforeUpdate = chatRoomRepository.findAll().size();
        chatRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatRoomMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chatRoom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatRoom in the database
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChatRoom() throws Exception {
        // Initialize the database
        chatRoomRepository.saveAndFlush(chatRoom);

        int databaseSizeBeforeDelete = chatRoomRepository.findAll().size();

        // Delete the chatRoom
        restChatRoomMockMvc
            .perform(delete(ENTITY_API_URL_ID, chatRoom.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChatRoom> chatRoomList = chatRoomRepository.findAll();
        assertThat(chatRoomList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
