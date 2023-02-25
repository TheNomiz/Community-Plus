package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class CrimeAlertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CrimeAlert.class);
        CrimeAlert crimeAlert1 = new CrimeAlert();
        crimeAlert1.setId(1L);
        CrimeAlert crimeAlert2 = new CrimeAlert();
        crimeAlert2.setId(crimeAlert1.getId());
        assertThat(crimeAlert1).isEqualTo(crimeAlert2);
        crimeAlert2.setId(2L);
        assertThat(crimeAlert1).isNotEqualTo(crimeAlert2);
        crimeAlert1.setId(null);
        assertThat(crimeAlert1).isNotEqualTo(crimeAlert2);
    }
}
