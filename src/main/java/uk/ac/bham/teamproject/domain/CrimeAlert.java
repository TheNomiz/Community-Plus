package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CrimeAlert.
 */
@Entity
@Table(name = "crime_alert")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CrimeAlert implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3, max = 30)
    @Column(name = "title", length = 30, nullable = false)
    private String title;

    @NotNull
    @Size(min = 20)
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "lat", precision = 21, scale = 2, nullable = false)
    private BigDecimal lat;

    @NotNull
    @Column(name = "lon", precision = 21, scale = 2, nullable = false)
    private BigDecimal lon;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Column(name = "crime_id", nullable = false, unique = true)
    private Long crimeID;

    @ManyToOne(optional = false)
    @NotNull
    private User postedby;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CrimeAlert id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public CrimeAlert title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public CrimeAlert description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getLat() {
        return this.lat;
    }

    public CrimeAlert lat(BigDecimal lat) {
        this.setLat(lat);
        return this;
    }

    public void setLat(BigDecimal lat) {
        this.lat = lat;
    }

    public BigDecimal getLon() {
        return this.lon;
    }

    public CrimeAlert lon(BigDecimal lon) {
        this.setLon(lon);
        return this;
    }

    public void setLon(BigDecimal lon) {
        this.lon = lon;
    }

    public Instant getDate() {
        return this.date;
    }

    public CrimeAlert date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Long getCrimeID() {
        return this.crimeID;
    }

    public CrimeAlert crimeID(Long crimeID) {
        this.setCrimeID(crimeID);
        return this;
    }

    public void setCrimeID(Long crimeID) {
        this.crimeID = crimeID;
    }

    public User getPostedby() {
        return this.postedby;
    }

    public void setPostedby(User user) {
        this.postedby = user;
    }

    public CrimeAlert postedby(User user) {
        this.setPostedby(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CrimeAlert)) {
            return false;
        }
        return id != null && id.equals(((CrimeAlert) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CrimeAlert{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", lat=" + getLat() +
            ", lon=" + getLon() +
            ", date='" + getDate() + "'" +
            ", crimeID=" + getCrimeID() +
            "}";
    }
}
