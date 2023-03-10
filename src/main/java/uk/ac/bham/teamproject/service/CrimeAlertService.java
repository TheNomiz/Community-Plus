package uk.ac.bham.teamproject.service;

import com.google.gson.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.CrimeAlert}.
 */
public interface CrimeAlertService {
    /**
     * Save a crimeAlert.
     *
     * @param crimeAlertDTO the entity to save.
     * @return the persisted entity.
     */
    CrimeAlertDTO save(CrimeAlertDTO crimeAlertDTO);

    /**
     * Updates a crimeAlert.
     *
     * @param crimeAlertDTO the entity to update.
     * @return the persisted entity.
     */
    CrimeAlertDTO update(CrimeAlertDTO crimeAlertDTO);

    /**
     * Partially updates a crimeAlert.
     *
     * @param crimeAlertDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CrimeAlertDTO> partialUpdate(CrimeAlertDTO crimeAlertDTO);

    /**
     * Get all the crimeAlerts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CrimeAlertDTO> findAll(Pageable pageable);

    /**
     * Get all the crimeAlerts with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CrimeAlertDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" crimeAlert.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CrimeAlertDTO> findOne(Long id);

    /**
     * Delete the "id" crimeAlert.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    @Autowired
    public CrimeAlertRepository crimeAlertRepository = null;

    @Scheduled(fixedDelay = 10000)
    public default void updateCrimeAlerts() {
        // fetch data from the APIs
        List<CrimeAlert> crimeAlerts = new ArrayList<>();
        crimeAlerts.addAll(fetchCrimeAlerts("51.192,0.974:51.166,0.406:51.312,0.189:51.491,0.382:51.534,0.826:51.192,0.974"));
        crimeAlerts.addAll(
            fetchCrimeAlerts(
                "51.507,-0.129:51.514,-0.155:51.508,-0.180:51.494,-0.186:51.487,-0.171:51.485,-0.146:51.485,-0.133:51.493,-0.128:51.507,-0.129"
            )
        );
        crimeAlerts.addAll(
            fetchCrimeAlerts(
                "51.448,-0.232:51.459,-0.309:51.457,-0.340:51.439,-0.366:51.416,-0.367:51.401,-0.341:51.397,-0.301:51.406,-0.257:51.448,-0.232"
            )
        );

        // save new entries to the database
        for (CrimeAlert crimeAlert : crimeAlerts) {
            Optional<CrimeAlert> entity = crimeAlertRepository.findById(crimeAlert.getId());

            if (entity == null && crimeAlert != null) {
                crimeAlertRepository.save(crimeAlert);
            }
        }
    }

    private List<CrimeAlert> fetchCrimeAlerts(String poly) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://data.police.uk/api/crimes-street/all-crime?poly=" + poly;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        Gson gson = new Gson();
        JsonArray jsonArray = gson.fromJson(response.getBody(), JsonArray.class);
        List<CrimeAlert> crimeAlerts = new ArrayList<>();
        for (JsonElement jsonElement : jsonArray) {
            JsonPrimitive idJson = jsonElement.getAsJsonObject().getAsJsonPrimitive("id");
            Long id = idJson.getAsLong();
            JsonPrimitive titleJson = jsonElement.getAsJsonObject().getAsJsonPrimitive("category");
            String title = titleJson.getAsString();
            JsonPrimitive descriptionJson = jsonElement.getAsJsonObject().getAsJsonPrimitive("location_type");
            String description = descriptionJson.getAsString();
            JsonPrimitive dateStringJson = jsonElement.getAsJsonObject().getAsJsonPrimitive("month");
            String dateString = dateStringJson.getAsString();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
            Instant date = YearMonth.parse(dateString, formatter).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            JsonPrimitive latJson = jsonElement.getAsJsonObject().getAsJsonObject("location").getAsJsonPrimitive("latitude");
            BigDecimal lat = latJson.getAsBigDecimal();
            JsonPrimitive lonJson = jsonElement.getAsJsonObject().getAsJsonObject("location").getAsJsonPrimitive("longitude");
            BigDecimal lon = lonJson.getAsBigDecimal();
            CrimeAlert crimeAlert = new CrimeAlert();
            crimeAlert.setId(id);
            crimeAlert.setTitle(title);
            crimeAlert.setDescription(description);
            crimeAlert.setDate(date);
            crimeAlert.setLat(lat);
            crimeAlert.setLon(lon);
            crimeAlert.setPostedby(null);

            crimeAlerts.add(crimeAlert);
        }
        return crimeAlerts;
    }
}
