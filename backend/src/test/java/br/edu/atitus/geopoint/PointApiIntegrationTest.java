package br.edu.atitus.geopoint;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PointApiIntegrationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;
    @Autowired private JdbcTemplate jdbc;

    @BeforeEach
    void clearDatabase() {
        jdbc.update("DELETE FROM points");
    }

    private String payload(String name, Object latitude, Object longitude) throws Exception {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("name", name);
        data.put("description", "Descricao teste");
        data.put("latitude", latitude);
        data.put("longitude", longitude);
        return mapper.writeValueAsString(data);
    }

    private String createAndReturnId(String name) throws Exception {
        MvcResult result = mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload(name, new BigDecimal("-28.2825"), new BigDecimal("-52.7869"))))
                .andExpect(status().isCreated())
                .andReturn();
        return mapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }

    @Test
    void fullCrudShouldWork() throws Exception {
        mvc.perform(get("/api/points"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        String id = createAndReturnId("  Praca Central  ");
        UUID.fromString(id);

        mvc.perform(get("/api/points"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Praca Central"));

        mvc.perform(get("/api/points/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));

        mvc.perform(put("/api/points/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("  Praca Renovada  ", -28.29, -52.80)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Praca Renovada"));

        mvc.perform(delete("/api/points/{id}", id))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/points/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void duplicateNamesShouldBeRejectedIgnoringCaseAndAfterTrim() throws Exception {
        createAndReturnId("Parque Municipal");
        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("  parque municipal  ", -28.3, -52.8)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void updateCanKeepItsOwnNameButCannotUseAnotherName() throws Exception {
        String first = createAndReturnId("Praca A");
        createAndReturnId("Praca B");
        mvc.perform(put("/api/points/{id}", first)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("  Praca A  ", -28.3, -52.8)))
                .andExpect(status().isOk());
        mvc.perform(put("/api/points/{id}", first)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Praca B", -28.3, -52.8)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidDataShouldBeRejected() throws Exception {
        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("    ", -28.3, -52.8)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.name").exists());

        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Fora da Faixa", 91, -52.8)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.latitude").exists());

        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Longitude invalida", -28, -181)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.longitude").exists());

        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Sem coordenadas\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.latitude").exists());
    }

    @Test
    void missingAndMalformedIdsShouldReturnCorrectErrors() throws Exception {
        String nonexistent = UUID.randomUUID().toString();
        mvc.perform(get("/api/points/{id}", nonexistent))
                .andExpect(status().isNotFound());
        mvc.perform(put("/api/points/{id}", nonexistent)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Nao existe", 0, 0)))
                .andExpect(status().isNotFound());
        mvc.perform(delete("/api/points/{id}", nonexistent))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/points/{id}", "nao-e-uuid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectMalformedJson() throws Exception {
        mvc.perform(post("/api/points")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ invalid-json"))
                .andExpect(status().isBadRequest());
    }
}
