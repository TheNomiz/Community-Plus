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
    @JsonIgnoreProperties(value = { "postedby", "room" }, allowSetters = true)
    private Set<ChatMessage> messages = new HashSet<>();

    @ManyToMany(mappedBy = "eventsrooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "postedby", "eventsrooms" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @ManyToMany(mappedBy = "businessrooms")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "postedby", "businessrooms" }, allowSetters = true)
    private Set<Business> businesses = new HashSet<>();

    @ManyToMany(mappedBy = "lostItems")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "postedby", "lostItems" }, allowSetters = true)
    private Set<LostFound> lostitems = new HashSet<>();

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
            this.events.forEach(i -> i.removeEventsroom(this));
        }
        if (events != null) {
            events.forEach(i -> i.addEventsroom(this));
        }
        this.events = events;
    }

    public ChatRoom events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public ChatRoom addEvents(Event event) {
        this.events.add(event);
        event.getEventsrooms().add(this);
        return this;
    }

    public ChatRoom removeEvents(Event event) {
        this.events.remove(event);
        event.getEventsrooms().remove(this);
        return this;
    }

    public Set<Business> getBusinesses() {
        return this.businesses;
    }

    public void setBusinesses(Set<Business> businesses) {
        if (this.businesses != null) {
            this.businesses.forEach(i -> i.removeBusinessroom(this));
        }
        if (businesses != null) {
            businesses.forEach(i -> i.addBusinessroom(this));
        }
        this.businesses = businesses;
    }

    public ChatRoom businesses(Set<Business> businesses) {
        this.setBusinesses(businesses);
        return this;
    }

    public ChatRoom addBusiness(Business business) {
        this.businesses.add(business);
        business.getBusinessrooms().add(this);
        return this;
    }

    public ChatRoom removeBusiness(Business business) {
        this.businesses.remove(business);
        business.getBusinessrooms().remove(this);
        return this;
    }

    public Set<LostFound> getLostitems() {
        return this.lostitems;
    }

    public void setLostitems(Set<LostFound> lostFounds) {
        if (this.lostitems != null) {
            this.lostitems.forEach(i -> i.removeLostItem(this));
        }
        if (lostFounds != null) {
            lostFounds.forEach(i -> i.addLostItem(this));
        }
        this.lostitems = lostFounds;
    }

    public ChatRoom lostitems(Set<LostFound> lostFounds) {
        this.setLostitems(lostFounds);
        return this;
    }

    public ChatRoom addLostitems(LostFound lostFound) {
        this.lostitems.add(lostFound);
        lostFound.getLostItems().add(this);
        return this;
    }

    public ChatRoom removeLostitems(LostFound lostFound) {
        this.lostitems.remove(lostFound);
        lostFound.getLostItems().remove(this);
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
