package uk.ac.bham.teamproject.web.rest;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import uk.ac.bham.teamproject.domain.ChatMessage;
import uk.ac.bham.teamproject.repository.ChatMessageRepository;

@Controller
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;

    public ChatController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @MessageMapping("/topic")
    @SendTo("/topic/{roomId}")
    public ChatMessage handleChatMessage(@Payload ChatMessage message) {
        // Return the saved message to all subscribers of the /topic/{roomId} destination

        // save message in database
        chatMessageRepository.save(message);

        message.getRoom().getId();

        return message;
    }
}
