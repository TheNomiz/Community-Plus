package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.ChatRoom;

/**
 * Spring Data JPA repository for the ChatRoom entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {}
