package uk.ac.bham.teamproject.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.ChatMessage;
import uk.ac.bham.teamproject.domain.ChatRoom;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.UserProfile;
//import uk.ac.bham.teamproject.repository.ChatMessageRepository;
import uk.ac.bham.teamproject.repository.ChatRoomRepository;
import uk.ac.bham.teamproject.repository.UserProfileRepository;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    //@Autowired
    //private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessage(ChatMessage message) {
        ChatRoom room = chatRoomRepository
            .findById(message.getRoom().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid chat room ID"));

        // Set the sender of the message to the current user
        User sender = userService.getUserWithAuthorities().orElseThrow(() -> new RuntimeException("Unable to retrieve current user"));
        UserProfile senders = getUserProfile(sender.getId());
        message.setPostedby(senders);

        // Set the timestamp of the message to the current time
        message.setSentDate(LocalDate.now());

        // Add the message to the chat room and save it
        room.getMessages().add(message);
        chatRoomRepository.save(room);

        // Send the message to all connected clients
        messagingTemplate.convertAndSend("/topic/" + message.getRoom().getId(), message);
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    public Set<ChatMessage> getMessagesForRoom(Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Invalid chat room ID"));
        return room.getMessages();
    }

    public UserProfile getUserProfile(Long id) {
        UserProfile user = userProfileRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return user;
    }
}
