package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class EmergencyStationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmergencyStations.class);
        EmergencyStations emergencyStations1 = new EmergencyStations();
        emergencyStations1.setId(1L);
        EmergencyStations emergencyStations2 = new EmergencyStations();
        emergencyStations2.setId(emergencyStations1.getId());
        assertThat(emergencyStations1).isEqualTo(emergencyStations2);
        emergencyStations2.setId(2L);
        assertThat(emergencyStations1).isNotEqualTo(emergencyStations2);
        emergencyStations1.setId(null);
        assertThat(emergencyStations1).isNotEqualTo(emergencyStations2);
    }
}
