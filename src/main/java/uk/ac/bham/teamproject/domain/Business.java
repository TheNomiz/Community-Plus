package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.BusinessCategory;

/**
 * A Business.
 */
@Entity
@Table(name = "business")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Business implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private BusinessCategory category;

    @NotNull
    @Size(min = 11)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotNull
    @Size(max = 254)
    @Column(name = "email", length = 254, nullable = false)
    private String email;

    @Size(max = 255)
    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @NotNull
    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @NotNull
    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userID" }, allowSetters = true)
    private UserProfile postedby;

    @ManyToMany
    @JoinTable(
        name = "rel_business__businessroom",
        joinColumns = @JoinColumn(name = "business_id"),
        inverseJoinColumns = @JoinColumn(name = "businessroom_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "messages", "events", "businesses", "lostitems" }, allowSetters = true)
    private Set<ChatRoom> businessrooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Business id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Business name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Business description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BusinessCategory getCategory() {
        return this.category;
    }

    public Business category(BusinessCategory category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(BusinessCategory category) {
        this.category = category;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Business phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return this.email;
    }

    public Business email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsiteUrl() {
        return this.websiteUrl;
    }

    public Business websiteUrl(String websiteUrl) {
        this.setWebsiteUrl(websiteUrl);
        return this;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public Business latitude(Double latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public Business longitude(Double longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public UserProfile getPostedby() {
        return this.postedby;
    }

    public void setPostedby(UserProfile userProfile) {
        this.postedby = userProfile;
    }

    public Business postedby(UserProfile userProfile) {
        this.setPostedby(userProfile);
        return this;
    }

    public Set<ChatRoom> getBusinessrooms() {
        return this.businessrooms;
    }

    public void setBusinessrooms(Set<ChatRoom> chatRooms) {
        this.businessrooms = chatRooms;
    }

    public Business businessrooms(Set<ChatRoom> chatRooms) {
        this.setBusinessrooms(chatRooms);
        return this;
    }

    public Business addBusinessroom(ChatRoom chatRoom) {
        this.businessrooms.add(chatRoom);
        chatRoom.getBusinesses().add(this);
        return this;
    }

    public Business removeBusinessroom(ChatRoom chatRoom) {
        this.businessrooms.remove(chatRoom);
        chatRoom.getBusinesses().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Business)) {
            return false;
        }
        return id != null && id.equals(((Business) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Business{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", category='" + getCategory() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", email='" + getEmail() + "'" +
            ", websiteUrl='" + getWebsiteUrl() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            "}";
    }
}
