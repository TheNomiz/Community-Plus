package uk.ac.bham.teamproject.service.impl;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import java.io.*;
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import javax.validation.constraints.Null;
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
import uk.ac.bham.teamproject.domain.EmergencyStationsDb;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.enumeration.StationsCategory;
import uk.ac.bham.teamproject.repository.EmergencyStationsDbRepository;
import uk.ac.bham.teamproject.repository.UserRepository;
import uk.ac.bham.teamproject.service.EmergencyStationsService;
import uk.ac.bham.teamproject.service.dto.EmergencyStationsDTO;
import uk.ac.bham.teamproject.service.mapper.EmergencyStationsMapper;

/**
 * Service Implementat ion for managing {@link EmergencyStationsDb}.
 */
@Service
@Transactional
public class EmergencyStationServiceImpl implements EmergencyStationsService {

    private final Logger log = LoggerFactory.getLogger(EmergencyStationServiceImpl.class);

    private final EmergencyStationsDbRepository emergencyStationsRepository;

    private final EmergencyStationsMapper emergencyStationsMapper;

    @Autowired
    private UserRepository userRepository;

    public EmergencyStationServiceImpl(
        EmergencyStationsDbRepository emergencyStationsRepository,
        EmergencyStationsMapper emergencyStationsMapper
    ) {
        this.emergencyStationsRepository = emergencyStationsRepository;
        this.emergencyStationsMapper = emergencyStationsMapper;
    }

    @Override
    public EmergencyStationsDTO save(EmergencyStationsDTO emergencyStationsDTO) {
        log.debug("Request to save EmergencyStation : {}", emergencyStationsDTO);
        EmergencyStationsDb emergencyStationsDb = emergencyStationsMapper.toEntity(emergencyStationsDTO);
        emergencyStationsDb = emergencyStationsRepository.save(emergencyStationsDb);
        return emergencyStationsMapper.toDto(emergencyStationsDb);
    }

    @Override
    public EmergencyStationsDTO update(EmergencyStationsDTO emergencyStationsDTO) {
        log.debug("Request to update EmergencyStations : {}", emergencyStationsDTO);
        EmergencyStationsDb emergencyStationsDb = emergencyStationsMapper.toEntity(emergencyStationsDTO);
        emergencyStationsDb = emergencyStationsRepository.save(emergencyStationsDb);
        return emergencyStationsMapper.toDto(emergencyStationsDb);
    }

    @Override
    public Optional<EmergencyStationsDTO> partialUpdate(EmergencyStationsDTO emergencyStationsDTO) {
        log.debug("Request to partially update EmergencyStations : {}", emergencyStationsDTO);

        return emergencyStationsRepository
            .findById(emergencyStationsDTO.getId())
            .map(existingEmergencyStation -> {
                emergencyStationsMapper.partialUpdate(existingEmergencyStation, emergencyStationsDTO);

                return existingEmergencyStation;
            })
            .map(emergencyStationsRepository::save)
            .map(emergencyStationsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmergencyStationsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all EmergencyStations");
        return emergencyStationsRepository.findAll(pageable).map(emergencyStationsMapper::toDto);
    }

    public Page<EmergencyStationsDTO> findAllWithEagerRelationships(Pageable pageable) {
        return emergencyStationsRepository.findAllWithEagerRelationships(pageable).map(emergencyStationsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmergencyStationsDTO> findOne(Long id) {
        log.debug("Request to get EmergencyStations : {}", id);
        return emergencyStationsRepository.findOneWithEagerRelationships(id).map(emergencyStationsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EmergencyStations : {}", id);
        emergencyStationsRepository.deleteById(id);
    }

    /*
    @Scheduled(fixedDelay = 100)
    public void updatePoliceStations() {
        // fetch data from the APIs
        List<EmergencyStationsDb> policeStations = new ArrayList<>();

        policeStations.addAll(fetchPoliceStations("leicestershire/NC66"));
        policeStations.addAll(fetchPoliceStations("leicestershire/NC67"));


        // save new entries to the database
        for (EmergencyStationsDb emergencyStationsDb : policeStations) {
            //Optional<CrimeAlert> entity = emergencyStationsRepository.findByCrimeID(crimeAlert.getCrimeID());

            emergencyStationsRepository.save(emergencyStationsDb);
        }
    }

    private List<EmergencyStationsDb> fetchPoliceStations(String place) {
        System.out.println("fetchPoliceStationsExecuted");
        Long id;

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://data.police.uk/api/" + place;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(response.getBody(), JsonObject.class);
        JsonArray locations = jsonObject.getAsJsonArray("locations");

        List<EmergencyStationsDb> policeStations = new ArrayList<>();
        for (JsonElement jsonElement : locations) {
            if (!jsonElement.getAsJsonObject().getAsJsonPrimitive("id").isJsonNull()) {
                id = jsonElement.getAsJsonObject().getAsJsonPrimitive("id").getAsLong();
            }
            String name = jsonElement.getAsJsonObject().getAsJsonPrimitive("name").getAsString();

            Double latitude = new Double(jsonElement.getAsJsonObject().getAsJsonPrimitive("latitude").getAsString());
            Double longitude = new Double(jsonElement.getAsJsonObject().getAsJsonPrimitive("longitude").getAsString());

            String type = jsonElement.getAsJsonObject().getAsJsonPrimitive("type").getAsString();

            if (type.equals("station")) {
                EmergencyStationsDb emergencyStationsDb = new EmergencyStationsDb();
                emergencyStationsDb.setId(id);
                emergencyStationsDb.setName(name);
                emergencyStationsDb.setStationType(StationsCategory.PoliceStation);
                emergencyStationsDb.setLatitude(latitude);
                emergencyStationsDb.setLongitude(longitude);

                policeStations.add(emergencyStationsDb);
            }
        }
        return policeStations;
    }
    */

    /*
    @Scheduled(fixedDelay = 10000)
    public void updateFireStations() {
        // fetch data from the APIs
        List<EmergencyStationsDb> fireStations = new ArrayList<>();

        fireStations.addAll(fetchFireStations());


        // save new entries to the database
        for (EmergencyStationsDb emergencyStationsDb : fireStations) {
            //Optional<CrimeAlert> entity = emergencyStationsRepository.findByCrimeID(crimeAlert.getCrimeID());

            emergencyStationsRepository.save(emergencyStationsDb);
        }
    }

    private List<EmergencyStationsDb> fetchFireStations() {

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://data.montgomerycountymd.gov/resource/funa-p396.json";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        Gson gson = new Gson();
        JsonArray jsonObject = gson.fromJson(response.getBody(), JsonArray.class);

        List<EmergencyStationsDb> fireStations = new ArrayList<>();
        for (JsonElement jsonElement : jsonObject) {
            //Long id = jsonElement.getAsJsonObject().getAsJsonPrimitive("fire_station_id").getAsLong();
            String name = jsonElement.getAsJsonObject().getAsJsonPrimitive("fire_station_name").getAsString();

            Double latitude = new Double(jsonElement.getAsJsonObject().getAsJsonObject("location_1").getAsJsonPrimitive("latitude").getAsString());
            Double longitude = new Double(jsonElement.getAsJsonObject().getAsJsonObject("location_1").getAsJsonPrimitive("longitude").getAsString());

            EmergencyStationsDb emergencyStationsDb = new EmergencyStationsDb();
            //emergencyStationsDb.setId(id);
            emergencyStationsDb.setName(name);
            emergencyStationsDb.setStationType(StationsCategory.FireStation);
            emergencyStationsDb.setLatitude(latitude);
            emergencyStationsDb.setLongitude(longitude);

            fireStations.add(emergencyStationsDb);
        }
        return fireStations;
    }
    */

    @Scheduled(fixedDelay = 3600000)
    public void updateHospitals() {
        // fetch data from the APIs
        List<EmergencyStationsDb> hospitals = new ArrayList<>();

        hospitals.addAll(fetchHospitals());

        // save new entries to the database
        for (EmergencyStationsDb emergencyStationsDb : hospitals) {
            //Optional<CrimeAlert> entity = emergencyStationsRepository.findByCrimeID(crimeAlert.getCrimeID());

            emergencyStationsRepository.save(emergencyStationsDb);
        }
    }

    public List<EmergencyStationsDb> fetchHospitals() {
        List<EmergencyStationsDb> hospitals = new ArrayList<>();
        try {
            Scanner sc = new Scanner(new File("./src/main/java/uk/ac/bham/teamproject/Hospital.csv"));
            sc.useDelimiter("¬"); //sets the delimiter pattern
            while (sc.hasNextLine()) {
                String[] attributes = sc.nextLine().split("¬");
                if (!attributes[0].isEmpty() && !attributes[7].isEmpty() && !attributes[14].isEmpty() && !attributes[15].isEmpty()) {
                    EmergencyStationsDb emergencyStationsDb = new EmergencyStationsDb();
                    emergencyStationsDb.setId(Long.parseLong(attributes[0]));
                    emergencyStationsDb.setName(attributes[7]);
                    emergencyStationsDb.setStationType(StationsCategory.Hospital);
                    emergencyStationsDb.setLatitude(Double.parseDouble(attributes[14]));
                    emergencyStationsDb.setLongitude(Double.parseDouble(attributes[15]));

                    hospitals.add(emergencyStationsDb);
                }
            }
            sc.close(); //closes the scanner
        } catch (IOException e) {
            e.printStackTrace();
        }
        return hospitals;
    }

    @Scheduled(fixedDelay = 3600000, initialDelay = 10000)
    public void updatePharmacies() {
        // fetch data from the APIs
        List<EmergencyStationsDb> pharmacies = new ArrayList<>();

        pharmacies.addAll(fetchPharmacies());

        // save new entries to the database
        for (EmergencyStationsDb emergencyStationsDb : pharmacies) {
            //Optional<CrimeAlert> entity = emergencyStationsRepository.findByCrimeID(crimeAlert.getCrimeID());

            emergencyStationsRepository.save(emergencyStationsDb);
        }
    }

    public List<EmergencyStationsDb> fetchPharmacies() {
        List<EmergencyStationsDb> pharmacies = new ArrayList<>();
        try {
            Scanner sc = new Scanner(new File("./src/main/java/uk/ac/bham/teamproject/Pharmacy.csv"));
            sc.useDelimiter("¬"); //sets the delimiter pattern
            while (sc.hasNextLine()) {
                String[] attributes = sc.nextLine().split("¬");
                if (!attributes[0].isEmpty() && !attributes[7].isEmpty() && !attributes[14].isEmpty() && !attributes[15].isEmpty()) {
                    EmergencyStationsDb emergencyStationsDb = new EmergencyStationsDb();
                    emergencyStationsDb.setId(Long.parseLong(attributes[0]));
                    emergencyStationsDb.setName(attributes[7]);
                    emergencyStationsDb.setStationType(StationsCategory.Pharmacy);
                    emergencyStationsDb.setLatitude(Double.parseDouble(attributes[14]));
                    emergencyStationsDb.setLongitude(Double.parseDouble(attributes[15]));

                    pharmacies.add(emergencyStationsDb);
                }
            }
            sc.close(); //closes the scanner
        } catch (IOException e) {
            e.printStackTrace();
        }
        return pharmacies;
    }
}
