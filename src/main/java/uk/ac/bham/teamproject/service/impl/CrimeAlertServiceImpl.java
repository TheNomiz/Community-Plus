package uk.ac.bham.teamproject.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.service.CrimeAlertService;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.mapper.CrimeAlertMapper;

/**
 * Service Implementation for managing {@link CrimeAlert}.
 */
@Service
@Transactional
public class CrimeAlertServiceImpl implements CrimeAlertService {

    private final Logger log = LoggerFactory.getLogger(CrimeAlertServiceImpl.class);

    private final CrimeAlertRepository crimeAlertRepository;

    private final CrimeAlertMapper crimeAlertMapper;

    public CrimeAlertServiceImpl(CrimeAlertRepository crimeAlertRepository, CrimeAlertMapper crimeAlertMapper) {
        this.crimeAlertRepository = crimeAlertRepository;
        this.crimeAlertMapper = crimeAlertMapper;
    }

    @Override
    public CrimeAlertDTO save(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to save CrimeAlert : {}", crimeAlertDTO);
        CrimeAlert crimeAlert = crimeAlertMapper.toEntity(crimeAlertDTO);
        crimeAlert = crimeAlertRepository.save(crimeAlert);
        return crimeAlertMapper.toDto(crimeAlert);
    }

    @Override
    public CrimeAlertDTO update(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to update CrimeAlert : {}", crimeAlertDTO);
        CrimeAlert crimeAlert = crimeAlertMapper.toEntity(crimeAlertDTO);
        crimeAlert = crimeAlertRepository.save(crimeAlert);
        return crimeAlertMapper.toDto(crimeAlert);
    }

    @Override
    public Optional<CrimeAlertDTO> partialUpdate(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to partially update CrimeAlert : {}", crimeAlertDTO);

        return crimeAlertRepository
            .findById(crimeAlertDTO.getId())
            .map(existingCrimeAlert -> {
                crimeAlertMapper.partialUpdate(existingCrimeAlert, crimeAlertDTO);

                return existingCrimeAlert;
            })
            .map(crimeAlertRepository::save)
            .map(crimeAlertMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CrimeAlertDTO> findAll(Pageable pageable) {
        log.debug("Request to get all CrimeAlerts");
        return crimeAlertRepository.findAll(pageable).map(crimeAlertMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CrimeAlertDTO> findOne(Long id) {
        log.debug("Request to get CrimeAlert : {}", id);
        return crimeAlertRepository.findById(id).map(crimeAlertMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CrimeAlert : {}", id);
        crimeAlertRepository.deleteById(id);
    }
}
