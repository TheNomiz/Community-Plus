package uk.ac.bham.teamproject.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import uk.ac.bham.teamproject.domain.enumeration.StationsCategory;

/**
 * A DTO for the {@link uk.ac.bham.teamproject.domain.CrimeAlert} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EmergencyStationsDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 1, max = 30)
    private String name;

    @NotNull
    private StationsCategory stationType;

    private boolean wheelchairAccess;

    private boolean parking;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public StationsCategory getStationType() {
        return stationType;
    }

    public void setStationType(StationsCategory stationType) {
        this.stationType = stationType;
    }

    public boolean getWheelchairAccess() {
        return wheelchairAccess;
    }

    public void setWheelchairAccess(boolean wheelchairAccess) {
        this.wheelchairAccess = wheelchairAccess;
    }

    public boolean getParking() {
        return parking;
    }

    public void setParking(boolean parking) {
        this.parking = parking;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmergencyStationsDTO)) {
            return false;
        }

        EmergencyStationsDTO emergencyStationsDTO = (EmergencyStationsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, emergencyStationsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmergencyStationsDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", stationType='" + getStationType() + "'" +
            ", wheelchairAccess=" + getWheelchairAccess() +
            ", parking=" + getParking() +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            "}";
    }
}
