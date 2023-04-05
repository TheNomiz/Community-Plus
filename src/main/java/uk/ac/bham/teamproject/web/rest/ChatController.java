package uk.ac.bham.teamproject.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.bham.teamproject.domain.ChatMessage;
import uk.ac.bham.teamproject.service.RabbitMQService;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RabbitMQService rabbitMQService;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void sendMessage(ChatMessage chatMessage) {
        rabbitMQService.sendMessage(chatMessage);
    }
}
