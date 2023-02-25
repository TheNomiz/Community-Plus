package uk.ac.bham.teamproject.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import uk.ac.bham.teamproject.domain.*; // for static metamodels
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.service.criteria.CrimeAlertCriteria;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.mapper.CrimeAlertMapper;

/**
 * Service for executing complex queries for {@link CrimeAlert} entities in the database.
 * The main input is a {@link CrimeAlertCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link CrimeAlertDTO} or a {@link Page} of {@link CrimeAlertDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class CrimeAlertQueryService extends QueryService<CrimeAlert> {

    private final Logger log = LoggerFactory.getLogger(CrimeAlertQueryService.class);

    private final CrimeAlertRepository crimeAlertRepository;

    private final CrimeAlertMapper crimeAlertMapper;

    public CrimeAlertQueryService(CrimeAlertRepository crimeAlertRepository, CrimeAlertMapper crimeAlertMapper) {
        this.crimeAlertRepository = crimeAlertRepository;
        this.crimeAlertMapper = crimeAlertMapper;
    }

    /**
     * Return a {@link List} of {@link CrimeAlertDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<CrimeAlertDTO> findByCriteria(CrimeAlertCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<CrimeAlert> specification = createSpecification(criteria);
        return crimeAlertMapper.toDto(crimeAlertRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link CrimeAlertDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<CrimeAlertDTO> findByCriteria(CrimeAlertCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<CrimeAlert> specification = createSpecification(criteria);
        return crimeAlertRepository.findAll(specification, page).map(crimeAlertMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(CrimeAlertCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<CrimeAlert> specification = createSpecification(criteria);
        return crimeAlertRepository.count(specification);
    }

    /**
     * Function to convert {@link CrimeAlertCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<CrimeAlert> createSpecification(CrimeAlertCriteria criteria) {
        Specification<CrimeAlert> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), CrimeAlert_.id));
            }
            if (criteria.getTitle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTitle(), CrimeAlert_.title));
            }
            if (criteria.getDescription() != null) {
                specification = specification.and(buildStringSpecification(criteria.getDescription(), CrimeAlert_.description));
            }
            if (criteria.getDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDate(), CrimeAlert_.date));
            }
            if (criteria.getLat() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLat(), CrimeAlert_.lat));
            }
            if (criteria.getLon() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLon(), CrimeAlert_.lon));
            }
        }
        return specification;
    }
}
