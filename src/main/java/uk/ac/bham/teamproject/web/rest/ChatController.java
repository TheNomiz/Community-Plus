package uk.ac.bham.teamproject.web.rest;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import uk.ac.bham.teamproject.domain.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/topic")
    @SendTo("/topic/{roomId}")
    public ChatMessage handleChatMessage(@Payload ChatMessage message) {
        // Return the saved message to all subscribers of the /topic/{roomId} destination

        message.getRoom().getId();

        return message;
    }
}
