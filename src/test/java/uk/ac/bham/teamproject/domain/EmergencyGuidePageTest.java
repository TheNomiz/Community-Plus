package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class EmergencyGuidePageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmergencyGuidePage.class);
        EmergencyGuidePage emergencyGuidePage1 = new EmergencyGuidePage();
        emergencyGuidePage1.setId(1L);
        EmergencyGuidePage emergencyGuidePage2 = new EmergencyGuidePage();
        emergencyGuidePage2.setId(emergencyGuidePage1.getId());
        assertThat(emergencyGuidePage1).isEqualTo(emergencyGuidePage2);
        emergencyGuidePage2.setId(2L);
        assertThat(emergencyGuidePage1).isNotEqualTo(emergencyGuidePage2);
        emergencyGuidePage1.setId(null);
        assertThat(emergencyGuidePage1).isNotEqualTo(emergencyGuidePage2);
    }
}
