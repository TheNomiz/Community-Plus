package uk.ac.bham.teamproject.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class CrimeAlertDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CrimeAlertDTO.class);
        CrimeAlertDTO crimeAlertDTO1 = new CrimeAlertDTO();
        crimeAlertDTO1.setId(1L);
        CrimeAlertDTO crimeAlertDTO2 = new CrimeAlertDTO();
        assertThat(crimeAlertDTO1).isNotEqualTo(crimeAlertDTO2);
        crimeAlertDTO2.setId(crimeAlertDTO1.getId());
        assertThat(crimeAlertDTO1).isEqualTo(crimeAlertDTO2);
        crimeAlertDTO2.setId(2L);
        assertThat(crimeAlertDTO1).isNotEqualTo(crimeAlertDTO2);
        crimeAlertDTO1.setId(null);
        assertThat(crimeAlertDTO1).isNotEqualTo(crimeAlertDTO2);
    }
}
