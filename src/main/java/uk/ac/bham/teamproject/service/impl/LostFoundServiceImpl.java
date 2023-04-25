package uk.ac.bham.teamproject.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.domain.LostFound;
import uk.ac.bham.teamproject.repository.LostFoundRepository;
import uk.ac.bham.teamproject.service.LostFoundService;

/**
 * Service Implementation for managing {@link LostFound}.
 */
@Service
@Transactional
public class LostFoundServiceImpl implements LostFoundService {

    private final Logger log = LoggerFactory.getLogger(LostFoundServiceImpl.class);

    private final LostFoundRepository lostFoundRepository;

    public LostFoundServiceImpl(LostFoundRepository lostFoundRepository) {
        this.lostFoundRepository = lostFoundRepository;
    }

    @Override
    public LostFound save(LostFound lostFound) {
        log.debug("Request to save LostFound : {}", lostFound);
        return lostFoundRepository.save(lostFound);
    }

    @Override
    public LostFound update(LostFound lostFound) {
        log.debug("Request to save LostFound : {}", lostFound);
        return lostFoundRepository.save(lostFound);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LostFound> findAll(Pageable pageable) {
        log.debug("Request to get all LostFounds");
        return lostFoundRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LostFound> findOne(Long id) {
        log.debug("Request to get LostFound : {}", id);
        return lostFoundRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete LostFound : {}", id);
        lostFoundRepository.deleteById(id);
    }
}
