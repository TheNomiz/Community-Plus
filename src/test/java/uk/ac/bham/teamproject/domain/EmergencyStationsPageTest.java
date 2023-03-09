package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class EmergencyStationsPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmergencyStationsPage.class);
        EmergencyStationsPage emergencyStationsPage1 = new EmergencyStationsPage();
        emergencyStationsPage1.setId(1L);
        EmergencyStationsPage emergencyStationsPage2 = new EmergencyStationsPage();
        emergencyStationsPage2.setId(emergencyStationsPage1.getId());
        assertThat(emergencyStationsPage1).isEqualTo(emergencyStationsPage2);
        emergencyStationsPage2.setId(2L);
        assertThat(emergencyStationsPage1).isNotEqualTo(emergencyStationsPage2);
        emergencyStationsPage1.setId(null);
        assertThat(emergencyStationsPage1).isNotEqualTo(emergencyStationsPage2);
    }
}
