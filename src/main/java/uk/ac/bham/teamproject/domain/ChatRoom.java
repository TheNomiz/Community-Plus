package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ChatRoom.
 */
@Entity
@Table(name = "chat_room")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChatRoom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @OneToMany(mappedBy = "room")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "room" }, allowSetters = true)
    private Set<ChatMessage> messages = new HashSet<>();

    @ManyToMany(mappedBy = "eventrooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventrooms" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @ManyToMany(mappedBy = "busrooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "busrooms" }, allowSetters = true)
    private Set<Business> businesses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChatRoom id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ChatRoom name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ChatMessage> getMessages() {
        return this.messages;
    }

    public void setMessages(Set<ChatMessage> chatMessages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setRoom(null));
        }
        if (chatMessages != null) {
            chatMessages.forEach(i -> i.setRoom(this));
        }
        this.messages = chatMessages;
    }

    public ChatRoom messages(Set<ChatMessage> chatMessages) {
        this.setMessages(chatMessages);
        return this;
    }

    public ChatRoom addMessages(ChatMessage chatMessage) {
        this.messages.add(chatMessage);
        chatMessage.setRoom(this);
        return this;
    }

    public ChatRoom removeMessages(ChatMessage chatMessage) {
        this.messages.remove(chatMessage);
        chatMessage.setRoom(null);
        return this;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.removeEventroom(this));
        }
        if (events != null) {
            events.forEach(i -> i.addEventroom(this));
        }
        this.events = events;
    }

    public ChatRoom events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public ChatRoom addEvents(Event event) {
        this.events.add(event);
        event.getEventrooms().add(this);
        return this;
    }

    public ChatRoom removeEvents(Event event) {
        this.events.remove(event);
        event.getEventrooms().remove(this);
        return this;
    }

    public Set<Business> getBusinesses() {
        return this.businesses;
    }

    public void setBusinesses(Set<Business> businesses) {
        if (this.businesses != null) {
            this.businesses.forEach(i -> i.removeBusroom(this));
        }
        if (businesses != null) {
            businesses.forEach(i -> i.addBusroom(this));
        }
        this.businesses = businesses;
    }

    public ChatRoom businesses(Set<Business> businesses) {
        this.setBusinesses(businesses);
        return this;
    }

    public ChatRoom addBusinesses(Business business) {
        this.businesses.add(business);
        business.getBusrooms().add(this);
        return this;
    }

    public ChatRoom removeBusinesses(Business business) {
        this.businesses.remove(business);
        business.getBusrooms().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChatRoom)) {
            return false;
        }
        return id != null && id.equals(((ChatRoom) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChatRoom{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
