package ma.zyn.app.unit.ws.facade.passenger.trajet;

import ma.zyn.app.bean.core.trajet.Trajet;
import ma.zyn.app.service.impl.passenger.trajet.TrajetPassengerServiceImpl;
import ma.zyn.app.ws.facade.passenger.trajet.TrajetRestPassenger;
import ma.zyn.app.ws.converter.trajet.TrajetConverter;
import ma.zyn.app.ws.dto.trajet.TrajetDto;
import org.aspectj.lang.annotation.Before;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TrajetRestPassengerTest {

    private MockMvc mockMvc;

    @Mock
    private TrajetPassengerServiceImpl service;
    @Mock
    private TrajetConverter converter;

    @InjectMocks
    private TrajetRestPassenger controller;

    @Before("")
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }


    @Test
    public void itShouldFindAllTrajetTest() throws Exception {
        // Mock the service to return an empty list
        when(service.findAll()).thenReturn(Collections.emptyList());
        when(converter.toDto(Collections.emptyList())).thenReturn(Collections.emptyList());

        // Call the controller method
        ResponseEntity<List<TrajetDto>> result = controller.findAll();

        // Verify the result
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());

        // Response body should be empty list
        List<TrajetDto> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertEquals(0, responseBody.size());
    }

    @Test
    public void itShouldSaveTrajetTest() throws Exception {
        // Mock data
        TrajetDto requestDto = new TrajetDto();
        Trajet entity = new Trajet();
        Trajet saved = new Trajet();
        TrajetDto savedDto = new TrajetDto();

        // Mock the converter to return the trajet object when converting from DTO
        when(converter.toItem(requestDto)).thenReturn(entity);

        // Mock the service to return the saved client
        when(service.create(entity)).thenReturn(saved);

        // Mock the converter to return the saved trajet DTO
        when(converter.toDto(saved)).thenReturn(savedDto);

        // Call the controller method
        ResponseEntity<TrajetDto> result = controller.save(requestDto);

        // Verify the result
        assertEquals(HttpStatus.CREATED, result.getStatusCode());

        // Verify the response body
        TrajetDto responseBody = result.getBody();
        assertNotNull(responseBody);

        // Add assertions to compare the response body with the saved trajet DTO
        assertEquals(savedDto.getHoraireDepart(), responseBody.getHoraireDepart());
        assertEquals(savedDto.getHoraireArrive(), responseBody.getHoraireArrive());
        assertEquals(savedDto.getPlacesDisponibles(), responseBody.getPlacesDisponibles());
        assertEquals(savedDto.getDateCreation(), responseBody.getDateCreation());
    }

}
