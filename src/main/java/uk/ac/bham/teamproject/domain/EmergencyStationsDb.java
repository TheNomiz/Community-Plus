package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.databind.ser.impl.PropertyBasedObjectIdGenerator;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import uk.ac.bham.teamproject.domain.enumeration.StationsCategory;

/**
 * A EmergencyStations.
 */
@Entity
@Table(name = "emergency_stations")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EmergencyStationsDb implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "station_type", nullable = false)
    private StationsCategory stationType;

    @Column(name = "wheelchair_access")
    private Boolean wheelchairAccess;

    @Column(name = "parking")
    private Boolean parking;

    @NotNull
    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @NotNull
    @Column(name = "longitude", nullable = false)
    private Double longitude;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EmergencyStationsDb id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public EmergencyStationsDb name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public StationsCategory getStationType() {
        return this.stationType;
    }

    public EmergencyStationsDb stationType(StationsCategory stationType) {
        this.setStationType(stationType);
        return this;
    }

    public void setStationType(StationsCategory stationType) {
        this.stationType = stationType;
    }

    public Boolean getWheelchairAccess() {
        return this.wheelchairAccess;
    }

    public EmergencyStationsDb wheelchairAccess(Boolean wheelchairAccess) {
        this.setWheelchairAccess(wheelchairAccess);
        return this;
    }

    public void setWheelchairAccess(Boolean wheelchairAccess) {
        this.wheelchairAccess = wheelchairAccess;
    }

    public Boolean getParking() {
        return this.parking;
    }

    public EmergencyStationsDb parking(Boolean parking) {
        this.setParking(parking);
        return this;
    }

    public void setParking(Boolean parking) {
        this.parking = parking;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public EmergencyStationsDb latitude(Double latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public EmergencyStationsDb longitude(Double longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmergencyStationsDb)) {
            return false;
        }
        return id != null && id.equals(((EmergencyStationsDb) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmergencyStations{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", stationType='" + getStationType() + "'" +
            ", wheelchairAccess='" + getWheelchairAccess() + "'" +
            ", parking='" + getParking() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            "}";
    }
}
