package uk.ac.bham.teamproject.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;
import uk.ac.bham.teamproject.domain.enumeration.CrimeTypes;

/**
 * Criteria class for the {@link uk.ac.bham.teamproject.domain.CrimeAlert} entity. This class is used
 * in {@link uk.ac.bham.teamproject.web.rest.CrimeAlertResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /crime-alerts?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CrimeAlertCriteria implements Serializable, Criteria {

    /**
     * Class for filtering CrimeTypes
     */
    public static class CrimeTypesFilter extends Filter<CrimeTypes> {

        public CrimeTypesFilter() {}

        public CrimeTypesFilter(CrimeTypesFilter filter) {
            super(filter);
        }

        @Override
        public CrimeTypesFilter copy() {
            return new CrimeTypesFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private StringFilter description;

    private BigDecimalFilter lat;

    private BigDecimalFilter lon;

    private InstantFilter date;

    private LongFilter crimeID;

    private CrimeTypesFilter crimeType;

    private LongFilter postedbyId;

    private Boolean distinct;

    public CrimeAlertCriteria() {}

    public CrimeAlertCriteria(CrimeAlertCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.title = other.title == null ? null : other.title.copy();
        this.description = other.description == null ? null : other.description.copy();
        this.lat = other.lat == null ? null : other.lat.copy();
        this.lon = other.lon == null ? null : other.lon.copy();
        this.date = other.date == null ? null : other.date.copy();
        this.crimeID = other.crimeID == null ? null : other.crimeID.copy();
        this.crimeType = other.crimeType == null ? null : other.crimeType.copy();
        this.postedbyId = other.postedbyId == null ? null : other.postedbyId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public CrimeAlertCriteria copy() {
        return new CrimeAlertCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitle() {
        return title;
    }

    public StringFilter title() {
        if (title == null) {
            title = new StringFilter();
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public StringFilter getDescription() {
        return description;
    }

    public StringFilter description() {
        if (description == null) {
            description = new StringFilter();
        }
        return description;
    }

    public void setDescription(StringFilter description) {
        this.description = description;
    }

    public BigDecimalFilter getLat() {
        return lat;
    }

    public BigDecimalFilter lat() {
        if (lat == null) {
            lat = new BigDecimalFilter();
        }
        return lat;
    }

    public void setLat(BigDecimalFilter lat) {
        this.lat = lat;
    }

    public BigDecimalFilter getLon() {
        return lon;
    }

    public BigDecimalFilter lon() {
        if (lon == null) {
            lon = new BigDecimalFilter();
        }
        return lon;
    }

    public void setLon(BigDecimalFilter lon) {
        this.lon = lon;
    }

    public InstantFilter getDate() {
        return date;
    }

    public InstantFilter date() {
        if (date == null) {
            date = new InstantFilter();
        }
        return date;
    }

    public void setDate(InstantFilter date) {
        this.date = date;
    }

    public LongFilter getCrimeID() {
        return crimeID;
    }

    public LongFilter crimeID() {
        if (crimeID == null) {
            crimeID = new LongFilter();
        }
        return crimeID;
    }

    public void setCrimeID(LongFilter crimeID) {
        this.crimeID = crimeID;
    }

    public CrimeTypesFilter getCrimeType() {
        return crimeType;
    }

    public CrimeTypesFilter crimeType() {
        if (crimeType == null) {
            crimeType = new CrimeTypesFilter();
        }
        return crimeType;
    }

    public void setCrimeType(CrimeTypesFilter crimeType) {
        this.crimeType = crimeType;
    }

    public LongFilter getPostedbyId() {
        return postedbyId;
    }

    public LongFilter postedbyId() {
        if (postedbyId == null) {
            postedbyId = new LongFilter();
        }
        return postedbyId;
    }

    public void setPostedbyId(LongFilter postedbyId) {
        this.postedbyId = postedbyId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final CrimeAlertCriteria that = (CrimeAlertCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(description, that.description) &&
            Objects.equals(lat, that.lat) &&
            Objects.equals(lon, that.lon) &&
            Objects.equals(date, that.date) &&
            Objects.equals(crimeID, that.crimeID) &&
            Objects.equals(crimeType, that.crimeType) &&
            Objects.equals(postedbyId, that.postedbyId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, lat, lon, date, crimeID, crimeType, postedbyId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CrimeAlertCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (title != null ? "title=" + title + ", " : "") +
            (description != null ? "description=" + description + ", " : "") +
            (lat != null ? "lat=" + lat + ", " : "") +
            (lon != null ? "lon=" + lon + ", " : "") +
            (date != null ? "date=" + date + ", " : "") +
            (crimeID != null ? "crimeID=" + crimeID + ", " : "") +
            (crimeType != null ? "crimeType=" + crimeType + ", " : "") +
            (postedbyId != null ? "postedbyId=" + postedbyId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
