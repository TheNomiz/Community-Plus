package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChatMessage.
 */
@Entity
@Table(name = "chat_message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChatMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @Column(name = "sent_date", nullable = false)
    private LocalDate sentDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "iD" }, allowSetters = true)
    private UserProfile postedby;

    @ManyToOne
    @JsonIgnoreProperties(value = { "messages", "events", "businesses", "lostitems" }, allowSetters = true)
    private ChatRoom room;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChatMessage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public ChatMessage content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getSentDate() {
        return this.sentDate;
    }

    public ChatMessage sentDate(LocalDate sentDate) {
        this.setSentDate(sentDate);
        return this;
    }

    public void setSentDate(LocalDate sentDate) {
        this.sentDate = sentDate;
    }

    public UserProfile getPostedby() {
        return this.postedby;
    }

    public void setPostedby(UserProfile userProfile) {
        this.postedby = userProfile;
    }

    public ChatMessage postedby(UserProfile userProfile) {
        this.setPostedby(userProfile);
        return this;
    }

    public ChatRoom getRoom() {
        return this.room;
    }

    public void setRoom(ChatRoom chatRoom) {
        this.room = chatRoom;
    }

    public ChatMessage room(ChatRoom chatRoom) {
        this.setRoom(chatRoom);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChatMessage)) {
            return false;
        }
        return id != null && id.equals(((ChatMessage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChatMessage{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", sentDate='" + getSentDate() + "'" +
            "}";
    }
}
