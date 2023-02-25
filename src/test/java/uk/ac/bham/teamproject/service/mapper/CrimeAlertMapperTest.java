package uk.ac.bham.teamproject.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CrimeAlertMapperTest {

    private CrimeAlertMapper crimeAlertMapper;

    @BeforeEach
    public void setUp() {
        crimeAlertMapper = new CrimeAlertMapperImpl();
    }
}
