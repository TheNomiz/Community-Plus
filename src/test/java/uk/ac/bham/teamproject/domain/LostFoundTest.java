package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class LostFoundTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LostFound.class);
        LostFound lostFound1 = new LostFound();
        lostFound1.setId(1L);
        LostFound lostFound2 = new LostFound();
        lostFound2.setId(lostFound1.getId());
        assertThat(lostFound1).isEqualTo(lostFound2);
        lostFound2.setId(2L);
        assertThat(lostFound1).isNotEqualTo(lostFound2);
        lostFound1.setId(null);
        assertThat(lostFound1).isNotEqualTo(lostFound2);
    }
}
