package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LostFound.
 */
@Entity
@Table(name = "lost_found")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LostFound implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "location", nullable = false)
    private String location;

    @NotNull
    @Column(name = "item", nullable = false)
    private String item;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Size(min = 11)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userID" }, allowSetters = true)
    private UserProfile postedby;

    @ManyToMany
    @JoinTable(
        name = "rel_lost_found__lost_item",
        joinColumns = @JoinColumn(name = "lost_found_id"),
        inverseJoinColumns = @JoinColumn(name = "lost_item_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "messages", "events", "businesses", "lostitems" }, allowSetters = true)
    private Set<ChatRoom> lostItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LostFound id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public LostFound description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public LostFound date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLocation() {
        return this.location;
    }

    public LostFound location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getItem() {
        return this.item;
    }

    public LostFound item(String item) {
        this.setItem(item);
        return this;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getName() {
        return this.name;
    }

    public LostFound name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public LostFound email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public LostFound phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UserProfile getPostedby() {
        return this.postedby;
    }

    public void setPostedby(UserProfile userProfile) {
        this.postedby = userProfile;
    }

    public LostFound postedby(UserProfile userProfile) {
        this.setPostedby(userProfile);
        return this;
    }

    public Set<ChatRoom> getLostItems() {
        return this.lostItems;
    }

    public void setLostItems(Set<ChatRoom> chatRooms) {
        this.lostItems = chatRooms;
    }

    public LostFound lostItems(Set<ChatRoom> chatRooms) {
        this.setLostItems(chatRooms);
        return this;
    }

    public LostFound addLostItem(ChatRoom chatRoom) {
        this.lostItems.add(chatRoom);
        chatRoom.getLostitems().add(this);
        return this;
    }

    public LostFound removeLostItem(ChatRoom chatRoom) {
        this.lostItems.remove(chatRoom);
        chatRoom.getLostitems().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LostFound)) {
            return false;
        }
        return id != null && id.equals(((LostFound) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LostFound{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", location='" + getLocation() + "'" +
            ", item='" + getItem() + "'" +
            ", name='" + getName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            "}";
    }
}
