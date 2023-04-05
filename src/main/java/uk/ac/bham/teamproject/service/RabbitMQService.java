package uk.ac.bham.teamproject.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import uk.ac.bham.teamproject.domain.ChatMessage;

@Service
public class RabbitMQService {

    private final RabbitTemplate rabbitTemplate;

    public RabbitMQService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(ChatMessage chatMessage) {
        rabbitTemplate.convertAndSend("chat-exchange", "chat-routing-key", chatMessage);
    }
}
