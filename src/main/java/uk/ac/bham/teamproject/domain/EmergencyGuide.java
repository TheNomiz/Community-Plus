package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EmergencyGuide.
 */
@Entity
@Table(name = "emergency_guide")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EmergencyGuide implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "emergency_type", nullable = false)
    private String emergencyType;

    @NotNull
    @Column(name = "panic_button", nullable = false)
    private Boolean panicButton;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EmergencyGuide id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmergencyType() {
        return this.emergencyType;
    }

    public EmergencyGuide emergencyType(String emergencyType) {
        this.setEmergencyType(emergencyType);
        return this;
    }

    public void setEmergencyType(String emergencyType) {
        this.emergencyType = emergencyType;
    }

    public Boolean getPanicButton() {
        return this.panicButton;
    }

    public EmergencyGuide panicButton(Boolean panicButton) {
        this.setPanicButton(panicButton);
        return this;
    }

    public void setPanicButton(Boolean panicButton) {
        this.panicButton = panicButton;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmergencyGuide)) {
            return false;
        }
        return id != null && id.equals(((EmergencyGuide) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmergencyGuide{" +
            "id=" + getId() +
            ", emergencyType='" + getEmergencyType() + "'" +
            ", panicButton='" + getPanicButton() + "'" +
            "}";
    }
}
