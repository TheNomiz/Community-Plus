package uk.ac.bham.teamproject.service.impl;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import uk.ac.bham.teamproject.domain.CrimeAlert;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.enumeration.CrimeTypes;
import uk.ac.bham.teamproject.repository.CrimeAlertRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.CrimeAlertService;
import uk.ac.bham.teamproject.service.dto.CrimeAlertDTO;
import uk.ac.bham.teamproject.service.mapper.CrimeAlertMapper;

/**
 * Service Implementat ion for managing {@link CrimeAlert}.
 */
@Service
@Transactional
public class CrimeAlertServiceImpl implements CrimeAlertService {

    private final Logger log = LoggerFactory.getLogger(CrimeAlertServiceImpl.class);

    private final CrimeAlertRepository crimeAlertRepository;

    private final CrimeAlertMapper crimeAlertMapper;

    @Autowired
    private UserRepository userRepository;

    public CrimeAlertServiceImpl(CrimeAlertRepository crimeAlertRepository, CrimeAlertMapper crimeAlertMapper) {
        this.crimeAlertRepository = crimeAlertRepository;
        this.crimeAlertMapper = crimeAlertMapper;
    }

    @Override
    public CrimeAlertDTO save(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to save CrimeAlert : {}", crimeAlertDTO);
        CrimeAlert crimeAlert = crimeAlertMapper.toEntity(crimeAlertDTO);
        crimeAlert = crimeAlertRepository.save(crimeAlert);
        return crimeAlertMapper.toDto(crimeAlert);
    }

    @Override
    public CrimeAlertDTO update(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to update CrimeAlert : {}", crimeAlertDTO);
        CrimeAlert crimeAlert = crimeAlertMapper.toEntity(crimeAlertDTO);
        crimeAlert = crimeAlertRepository.save(crimeAlert);
        return crimeAlertMapper.toDto(crimeAlert);
    }

    @Override
    public Optional<CrimeAlertDTO> partialUpdate(CrimeAlertDTO crimeAlertDTO) {
        log.debug("Request to partially update CrimeAlert : {}", crimeAlertDTO);

        return crimeAlertRepository
            .findById(crimeAlertDTO.getId())
            .map(existingCrimeAlert -> {
                crimeAlertMapper.partialUpdate(existingCrimeAlert, crimeAlertDTO);

                return existingCrimeAlert;
            })
            .map(crimeAlertRepository::save)
            .map(crimeAlertMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CrimeAlertDTO> findAll(Pageable pageable) {
        log.debug("Request to get all CrimeAlerts");
        return crimeAlertRepository.findAll(pageable).map(crimeAlertMapper::toDto);
    }

    public Page<CrimeAlertDTO> findAllWithEagerRelationships(Pageable pageable) {
        return crimeAlertRepository.findAllWithEagerRelationships(pageable).map(crimeAlertMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CrimeAlertDTO> findOne(Long id) {
        log.debug("Request to get CrimeAlert : {}", id);
        return crimeAlertRepository.findOneWithEagerRelationships(id).map(crimeAlertMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CrimeAlert : {}", id);
        crimeAlertRepository.deleteById(id);
    }

    @Scheduled(fixedDelay = 3600000)
    public void updateCrimeAlerts() {
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
        crimeAlerts.addAll(fetchCrimeAlerts("51.526,-2.536:51.548,-2.677:51.388,-2.654:51.388,-2.529:51.526,-2.536"));
        crimeAlerts.addAll(fetchCrimeAlerts("50.863,-1.385:50.950,-1.521:50.925,-1.151:50.814,-1.064:50.793,-1.233:50.863,-1.385"));
        crimeAlerts.addAll(
            fetchCrimeAlerts("50.685,-1.843:50.747,-1.991:50.734,-2.178:50.667,-2.203:50.599,-2.038:50.585,-1.867:50.685,-1.843")
        );

        crimeAlerts.addAll(
            fetchCrimeAlerts(
                "53.447,-2.326:53.491,-2.263:53.513,-2.320:53.513,-2.368:53.495,-2.391:53.475,-2.384:53.463,-2.364:53.447,-2.326"
            )
        );

        crimeAlerts.addAll(fetchCrimeAlerts("53.406,-2.979:53.430,-2.997:53.410,-3.049:53.358"));
        crimeAlerts.addAll(fetchCrimeAlerts("52.634,-2.109:52.646,-2.413:52.453,-2.480:52.431,-2.185"));
        crimeAlerts.addAll(fetchCrimeAlerts("52.035,0.806:52.189,0.098:52.535,0.163:52.604,1.297:52.316,1.604:52.035,0.806"));

        crimeAlerts.addAll(fetchCrimeAlerts("52.454,-1.818:52.487,-1.911:52.449,-1.955:52.408,-1.925:52.412,-1.832:52.454,-1.818"));
        crimeAlerts.addAll(fetchCrimeAlerts("52.635,-1.129:52.638,-1.209:52.589,-1.217:52.585,-1.123:52.635,-1.129"));
        crimeAlerts.addAll(fetchCrimeAlerts("52.939,-1.168:52.947,-1.203:52.907,-1.206:52.905,-1.177:52.919,-1.152:52.939,-1.168"));

        crimeAlerts.addAll(fetchCrimeAlerts("53.802,-1.518:53.853,-1.610:53.788,-1.704:53.749,-1.604:53.802,-1.518"));
        crimeAlerts.addAll(fetchCrimeAlerts("53.345,-1.428:53.405,-1.484:53.365,-1.543:53.308,-1.488:53.345,-1.428"));
        crimeAlerts.addAll(fetchCrimeAlerts("53.773,-0.261:53.822,-0.362:53.736,-0.406:53.711,-0.315:53.773,-0.261"));
        // save new entries to the database
        for (CrimeAlert crimeAlert : crimeAlerts) {
            //Optional<CrimeAlert> entity = crimeAlertRepository.findByCrimeID(crimeAlert.getCrimeID());

            crimeAlertRepository.save(crimeAlert);
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
            String description = "This crime happened in: " + descriptionJson.getAsString();
            JsonPrimitive dateStringJson = jsonElement.getAsJsonObject().getAsJsonPrimitive("month");
            String dateString = dateStringJson.getAsString();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
            Instant date = YearMonth.parse(dateString, formatter).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            JsonPrimitive latJson = jsonElement.getAsJsonObject().getAsJsonObject("location").getAsJsonPrimitive("latitude");

            BigDecimal lat = new BigDecimal(latJson.getAsString());
            JsonPrimitive lonJson = jsonElement.getAsJsonObject().getAsJsonObject("location").getAsJsonPrimitive("longitude");
            BigDecimal lon = new BigDecimal(lonJson.getAsString());
            CrimeAlert crimeAlert = new CrimeAlert();
            crimeAlert.setId(id);
            crimeAlert.setTitle(title);
            crimeAlert.setDescription(description);
            crimeAlert.setDate(date);
            crimeAlert.setLat(lat);
            crimeAlert.setLon(lon);
            crimeAlert.setCrimeID(id);
            CrimeTypes t;
            if (title.equals("all-crime")) t = CrimeTypes.ALLCRIME; else if (title.equals("anti-social-behaviour")) t =
                CrimeTypes.ANTISOCIALBEHAVIOUR; else if (title.equals("bicycle-theft")) t = CrimeTypes.BICYCLETHEFT; else if (
                title.equals("burglary")
            ) t = CrimeTypes.BURGLARY; else if (title.equals("criminal-damage-arson")) t = CrimeTypes.CRIMINALDAMAGEARSON; else if (
                title.equals("drugs")
            ) t = CrimeTypes.DRUGS; else if (title.equals("other-theft")) t = CrimeTypes.OTHERTHEFT; else if (
                title.equals("possession-of-weapons")
            ) t = CrimeTypes.POSSESSIONOFWEAPONS; else if (title.equals("public-order")) t = CrimeTypes.PUBLICORDER; else if (
                title.equals("robbery")
            ) t = CrimeTypes.ROBBERY; else if (title.equals("shoplifting")) t = CrimeTypes.SHOPLIFTING; else if (
                title.equals("theft-from-the-person")
            ) t = CrimeTypes.THEFTFROMTHEPERSON; else if (title.equals("vehicle-crime")) t = CrimeTypes.VEHICLECRIME; else if (
                title.equals("violent-crime")
            ) t = CrimeTypes.VIOLENCEANDSEXUALOFFENCES; else if (title.equals("anti-social-behaviour")) t =
                CrimeTypes.ANTISOCIALBEHAVIOUR; else t = CrimeTypes.OTHERCRIME;
            crimeAlert.setCrimeType(t);

            Optional<User> optionalUser = userRepository.findById(1L);
            User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));

            crimeAlert.setPostedby(user);

            crimeAlerts.add(crimeAlert);
        }
        return crimeAlerts;
    }
}
