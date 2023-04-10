package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.CrimeTypes;

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
    @Column(name = "lat", precision = 21, scale = 5, nullable = false)
    private BigDecimal lat;

    @NotNull
    @Column(name = "lon", precision = 21, scale = 5, nullable = false)
    private BigDecimal lon;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Column(name = "crime_id", nullable = false, unique = true)
    private Long crimeID;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "crime_type", nullable = false)
    private CrimeTypes crimeType;

    @Lob
    @Column(name = "crime_photo_1")
    private byte[] crimePhoto1;

    @Column(name = "crime_photo_1_content_type")
    private String crimePhoto1ContentType;

    @Lob
    @Column(name = "crime_photo_2")
    private byte[] crimePhoto2;

    @Column(name = "crime_photo_2_content_type")
    private String crimePhoto2ContentType;

    @Lob
    @Column(name = "crime_photo_3")
    private byte[] crimePhoto3;

    @Column(name = "crime_photo_3_content_type")
    private String crimePhoto3ContentType;

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

    public CrimeTypes getCrimeType() {
        return this.crimeType;
    }

    public CrimeAlert crimeType(CrimeTypes crimeType) {
        this.setCrimeType(crimeType);
        return this;
    }

    public void setCrimeType(CrimeTypes crimeType) {
        this.crimeType = crimeType;
    }

    public byte[] getCrimePhoto1() {
        return this.crimePhoto1;
    }

    public CrimeAlert crimePhoto1(byte[] crimePhoto1) {
        this.setCrimePhoto1(crimePhoto1);
        return this;
    }

    public void setCrimePhoto1(byte[] crimePhoto1) {
        this.crimePhoto1 = crimePhoto1;
    }

    public String getCrimePhoto1ContentType() {
        return this.crimePhoto1ContentType;
    }

    public CrimeAlert crimePhoto1ContentType(String crimePhoto1ContentType) {
        this.crimePhoto1ContentType = crimePhoto1ContentType;
        return this;
    }

    public void setCrimePhoto1ContentType(String crimePhoto1ContentType) {
        this.crimePhoto1ContentType = crimePhoto1ContentType;
    }

    public byte[] getCrimePhoto2() {
        return this.crimePhoto2;
    }

    public CrimeAlert crimePhoto2(byte[] crimePhoto2) {
        this.setCrimePhoto2(crimePhoto2);
        return this;
    }

    public void setCrimePhoto2(byte[] crimePhoto2) {
        this.crimePhoto2 = crimePhoto2;
    }

    public String getCrimePhoto2ContentType() {
        return this.crimePhoto2ContentType;
    }

    public CrimeAlert crimePhoto2ContentType(String crimePhoto2ContentType) {
        this.crimePhoto2ContentType = crimePhoto2ContentType;
        return this;
    }

    public void setCrimePhoto2ContentType(String crimePhoto2ContentType) {
        this.crimePhoto2ContentType = crimePhoto2ContentType;
    }

    public byte[] getCrimePhoto3() {
        return this.crimePhoto3;
    }

    public CrimeAlert crimePhoto3(byte[] crimePhoto3) {
        this.setCrimePhoto3(crimePhoto3);
        return this;
    }

    public void setCrimePhoto3(byte[] crimePhoto3) {
        this.crimePhoto3 = crimePhoto3;
    }

    public String getCrimePhoto3ContentType() {
        return this.crimePhoto3ContentType;
    }

    public CrimeAlert crimePhoto3ContentType(String crimePhoto3ContentType) {
        this.crimePhoto3ContentType = crimePhoto3ContentType;
        return this;
    }

    public void setCrimePhoto3ContentType(String crimePhoto3ContentType) {
        this.crimePhoto3ContentType = crimePhoto3ContentType;
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
            ", crimeType='" + getCrimeType() + "'" +
            ", crimePhoto1='" + getCrimePhoto1() + "'" +
            ", crimePhoto1ContentType='" + getCrimePhoto1ContentType() + "'" +
            ", crimePhoto2='" + getCrimePhoto2() + "'" +
            ", crimePhoto2ContentType='" + getCrimePhoto2ContentType() + "'" +
            ", crimePhoto3='" + getCrimePhoto3() + "'" +
            ", crimePhoto3ContentType='" + getCrimePhoto3ContentType() + "'" +
            "}";
    }
}
