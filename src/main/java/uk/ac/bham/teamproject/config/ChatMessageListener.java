package uk.ac.bham.teamproject.config;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import uk.ac.bham.teamproject.domain.ChatMessage;

@Component
public class ChatMessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessageListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "chat-queue")
    public void handleMessage(ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/topic/" + chatMessage.getRoom().getId(), chatMessage);
    }
}
