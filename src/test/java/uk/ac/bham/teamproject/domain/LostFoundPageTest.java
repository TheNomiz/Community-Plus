package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class LostFoundPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LostFoundPage.class);
        LostFoundPage lostFoundPage1 = new LostFoundPage();
        lostFoundPage1.setId(1L);
        LostFoundPage lostFoundPage2 = new LostFoundPage();
        lostFoundPage2.setId(lostFoundPage1.getId());
        assertThat(lostFoundPage1).isEqualTo(lostFoundPage2);
        lostFoundPage2.setId(2L);
        assertThat(lostFoundPage1).isNotEqualTo(lostFoundPage2);
        lostFoundPage1.setId(null);
        assertThat(lostFoundPage1).isNotEqualTo(lostFoundPage2);
    }
}
