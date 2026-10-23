package kz.damtap.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:damtap-admin-disabled;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.seed-demo=false",
        "app.admin-key="
})
@AutoConfigureMockMvc
class AdminDisabledTest {
    @Autowired MockMvc mvc;

    @Test
    void adminApiIsDisabledUntilAnEnvironmentKeyIsConfigured() throws Exception {
        mvc.perform(get("/api/admin/partner-applications").header("X-Admin-Key", "anything"))
                .andExpect(status().isServiceUnavailable());
    }
}
