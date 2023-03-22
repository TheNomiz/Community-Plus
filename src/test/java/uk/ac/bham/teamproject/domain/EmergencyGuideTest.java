package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class EmergencyGuideTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmergencyGuide.class);
        EmergencyGuide emergencyGuide1 = new EmergencyGuide();
        emergencyGuide1.setId(1L);
        EmergencyGuide emergencyGuide2 = new EmergencyGuide();
        emergencyGuide2.setId(emergencyGuide1.getId());
        assertThat(emergencyGuide1).isEqualTo(emergencyGuide2);
        emergencyGuide2.setId(2L);
        assertThat(emergencyGuide1).isNotEqualTo(emergencyGuide2);
        emergencyGuide1.setId(null);
        assertThat(emergencyGuide1).isNotEqualTo(emergencyGuide2);
    }
}
