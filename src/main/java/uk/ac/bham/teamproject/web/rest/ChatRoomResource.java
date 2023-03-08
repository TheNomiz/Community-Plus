package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.ChatRoom;
import uk.ac.bham.teamproject.repository.ChatRoomRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.ChatRoom}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChatRoomResource {

    private final Logger log = LoggerFactory.getLogger(ChatRoomResource.class);

    private static final String ENTITY_NAME = "chatRoom";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomResource(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    /**
     * {@code POST  /chat-rooms} : Create a new chatRoom.
     *
     * @param chatRoom the chatRoom to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chatRoom, or with status {@code 400 (Bad Request)} if the chatRoom has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chat-rooms")
    public ResponseEntity<ChatRoom> createChatRoom(@Valid @RequestBody ChatRoom chatRoom) throws URISyntaxException {
        log.debug("REST request to save ChatRoom : {}", chatRoom);
        if (chatRoom.getId() != null) {
            throw new BadRequestAlertException("A new chatRoom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChatRoom result = chatRoomRepository.save(chatRoom);
        return ResponseEntity
            .created(new URI("/api/chat-rooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chat-rooms/:id} : Updates an existing chatRoom.
     *
     * @param id the id of the chatRoom to save.
     * @param chatRoom the chatRoom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatRoom,
     * or with status {@code 400 (Bad Request)} if the chatRoom is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chatRoom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chat-rooms/{id}")
    public ResponseEntity<ChatRoom> updateChatRoom(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChatRoom chatRoom
    ) throws URISyntaxException {
        log.debug("REST request to update ChatRoom : {}, {}", id, chatRoom);
        if (chatRoom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatRoom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatRoomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChatRoom result = chatRoomRepository.save(chatRoom);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chatRoom.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chat-rooms/:id} : Partial updates given fields of an existing chatRoom, field will ignore if it is null
     *
     * @param id the id of the chatRoom to save.
     * @param chatRoom the chatRoom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatRoom,
     * or with status {@code 400 (Bad Request)} if the chatRoom is not valid,
     * or with status {@code 404 (Not Found)} if the chatRoom is not found,
     * or with status {@code 500 (Internal Server Error)} if the chatRoom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chat-rooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChatRoom> partialUpdateChatRoom(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChatRoom chatRoom
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChatRoom partially : {}, {}", id, chatRoom);
        if (chatRoom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatRoom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatRoomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChatRoom> result = chatRoomRepository
            .findById(chatRoom.getId())
            .map(existingChatRoom -> {
                if (chatRoom.getName() != null) {
                    existingChatRoom.setName(chatRoom.getName());
                }

                return existingChatRoom;
            })
            .map(chatRoomRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chatRoom.getId().toString())
        );
    }

    /**
     * {@code GET  /chat-rooms} : get all the chatRooms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatRooms in body.
     */
    @GetMapping("/chat-rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ChatRooms");
        Page<ChatRoom> page = chatRoomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chat-rooms/:id} : get the "id" chatRoom.
     *
     * @param id the id of the chatRoom to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chatRoom, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chat-rooms/{id}")
    public ResponseEntity<ChatRoom> getChatRoom(@PathVariable Long id) {
        log.debug("REST request to get ChatRoom : {}", id);
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chatRoom);
    }

    /**
     * {@code DELETE  /chat-rooms/:id} : delete the "id" chatRoom.
     *
     * @param id the id of the chatRoom to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chat-rooms/{id}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable Long id) {
        log.debug("REST request to delete ChatRoom : {}", id);
        chatRoomRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
