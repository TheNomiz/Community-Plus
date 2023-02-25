package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.CrimeAlert} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CrimeAlertDTO implements Serializable {

    private Long id;

    private String title;

    private String description;

    @NotNull
    private Instant date;

    private BigDecimal lat;

    private BigDecimal lon;

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

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
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
            ", date='" + getDate() + "'" +
            ", lat=" + getLat() +
            ", lon=" + getLon() +
            "}";
    }
}
