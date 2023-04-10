package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;
import uk.ac.bham.teamproject.domain.enumeration.CrimeTypes;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.CrimeAlert} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CrimeAlertDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 3, max = 30)
    private String title;

    @NotNull
    @Size(min = 20)
    private String description;

    @NotNull
    private BigDecimal lat;

    @NotNull
    private BigDecimal lon;

    @NotNull
    private Instant date;

    @NotNull
    private Long crimeID;

    @NotNull
    private CrimeTypes crimeType;

    @Lob
    private byte[] crimePhoto1;

    private String crimePhoto1ContentType;

    @Lob
    private byte[] crimePhoto2;

    private String crimePhoto2ContentType;

    @Lob
    private byte[] crimePhoto3;

    private String crimePhoto3ContentType;
    private UserDTO postedby;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getLat() {
        return lat;
    }

    public void setLat(BigDecimal lat) {
        this.lat = lat;
    }

    public BigDecimal getLon() {
        return lon;
    }

    public void setLon(BigDecimal lon) {
        this.lon = lon;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Long getCrimeID() {
        return crimeID;
    }

    public void setCrimeID(Long crimeID) {
        this.crimeID = crimeID;
    }

    public CrimeTypes getCrimeType() {
        return crimeType;
    }

    public void setCrimeType(CrimeTypes crimeType) {
        this.crimeType = crimeType;
    }

    public byte[] getCrimePhoto1() {
        return crimePhoto1;
    }

    public void setCrimePhoto1(byte[] crimePhoto1) {
        this.crimePhoto1 = crimePhoto1;
    }

    public String getCrimePhoto1ContentType() {
        return crimePhoto1ContentType;
    }

    public void setCrimePhoto1ContentType(String crimePhoto1ContentType) {
        this.crimePhoto1ContentType = crimePhoto1ContentType;
    }

    public byte[] getCrimePhoto2() {
        return crimePhoto2;
    }

    public void setCrimePhoto2(byte[] crimePhoto2) {
        this.crimePhoto2 = crimePhoto2;
    }

    public String getCrimePhoto2ContentType() {
        return crimePhoto2ContentType;
    }

    public void setCrimePhoto2ContentType(String crimePhoto2ContentType) {
        this.crimePhoto2ContentType = crimePhoto2ContentType;
    }

    public byte[] getCrimePhoto3() {
        return crimePhoto3;
    }

    public void setCrimePhoto3(byte[] crimePhoto3) {
        this.crimePhoto3 = crimePhoto3;
    }

    public String getCrimePhoto3ContentType() {
        return crimePhoto3ContentType;
    }

    public void setCrimePhoto3ContentType(String crimePhoto3ContentType) {
        this.crimePhoto3ContentType = crimePhoto3ContentType;
    }

    public UserDTO getPostedby() {
        return postedby;
    }

    public void setPostedby(UserDTO postedby) {
        this.postedby = postedby;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CrimeAlertDTO)) {
            return false;
        }

        CrimeAlertDTO crimeAlertDTO = (CrimeAlertDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, crimeAlertDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CrimeAlertDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", lat=" + getLat() +
            ", lon=" + getLon() +
            ", date='" + getDate() + "'" +
            ", crimeID=" + getCrimeID() +
            ", crimeType='" + getCrimeType() + "'" +
            ", crimePhoto1='" + getCrimePhoto1() + "'" +
            ", crimePhoto2='" + getCrimePhoto2() + "'" +
            ", crimePhoto3='" + getCrimePhoto3() + "'" +
            ", postedby=" + getPostedby() +
            "}";
    }
}
