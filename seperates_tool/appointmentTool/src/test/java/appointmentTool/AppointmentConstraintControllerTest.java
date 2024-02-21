package appointmentTool;

import appointmentTool.controller.AppointmentConstraintController;
import appointmentTool.entity.AppointmentConstraint;
import appointmentTool.repository.AppointmentConstraintRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the AppointmentConstraintController class.
 */
@ExtendWith(MockitoExtension.class)
public class AppointmentConstraintControllerTest {

    // Mock the AppointmentConstraintRepository to isolate the controller for testing
    @Mock
    private AppointmentConstraintRepository appointmentConstraintRepository;

    // Inject mocks into the AppointmentConstraintController
    @InjectMocks
    private AppointmentConstraintController appointmentConstraintController;

    /**
     * Test the getAllAppointmentConstraints method of the controller.
     */
    @Test
    public void testGetAllAppointmentConstraints() {
        // Mock data: Create a list with a sample AppointmentConstraint
        List<AppointmentConstraint> appointmentConstraints = Collections.singletonList(new AppointmentConstraint());
        // Mock behavior: When findAll() is called on the repository, return the sample data
        when(appointmentConstraintRepository.findAll()).thenReturn(appointmentConstraints);

        // Call the controller method
        ResponseEntity<List<AppointmentConstraint>> responseEntity = appointmentConstraintController.getAllAppointmentConstraints();

        // Verify the response
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(appointmentConstraints, responseEntity.getBody());

        // Verify that the repository's findAll() method was called once
        verify(appointmentConstraintRepository, times(1)).findAll();
    }

    // Similar tests for other controller methods (getAppointmentConstraintById, createAppointmentConstraint, updateAppointmentConstraint, deleteAppointmentConstraint, getAllAppointmentsArray)

    /**
     * Test the createAppointmentConstraint method of the controller.
     */
    @Test
    public void testCreateAppointmentConstraint() {
        // Mock data: Create a sample AppointmentConstraintDTO
        AppointmentConstraintDTO appointmentDTO = new AppointmentConstraintDTO("course123", LocalDate.now(), true);
        // Mock behavior: When existsByCourseIDAndAvailability() is called, return false (no conflict)
        when(appointmentConstraintRepository.existsByCourseIDAndAvailability(anyString(), anyBoolean())).thenReturn(false);
        // Mock behavior: When existsByCourseIDAndDate() is called, return false (no conflict)
        when(appointmentConstraintRepository.existsByCourseIDAndDate(anyString(), any(LocalDate.class))).thenReturn(false);
        // Mock behavior: When save() is called on the repository, return the same AppointmentConstraint
        when(appointmentConstraintRepository.save(any(AppointmentConstraint.class))).thenReturn(new AppointmentConstraint());

        // Call the controller method
        ResponseEntity<AppointmentConstraint> responseEntity = appointmentConstraintController.createAppointmentConstraint(appointmentDTO);

        // Verify the response
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());

        // Verify that the repository's methods were called appropriately
        verify(appointmentConstraintRepository, times(1)).existsByCourseIDAndAvailability(eq("course123"), eq(true));
        verify(appointmentConstraintRepository, times(1)).existsByCourseIDAndDate(eq("course123"), any(LocalDate.class));
        verify(appointmentConstraintRepository, times(1)).save(any(AppointmentConstraint.class));
    }

    /**
     * Test the getAppointmentConstraintById method of the controller.
     */
    @Test
    public void testGetAppointmentConstraintById() {
        // Mock data: Create a sample AppointmentConstraint with ID 1
        AppointmentConstraint appointmentConstraint = new AppointmentConstraint(LocalDate.now(), "course123", true);
        appointmentConstraint.setId(1L);
        // Mock behavior: When findById() is called on the repository, return the sample data
        when(appointmentConstraintRepository.findById(1L)).thenReturn(Optional.of(appointmentConstraint));

        // Call the controller method
        ResponseEntity<AppointmentConstraint> responseEntity = appointmentConstraintController.getAppointmentConstraintById(1L);

        // Verify the response
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(appointmentConstraint, responseEntity.getBody());

        // Verify that the repository's findById() method was called once with the correct ID
        verify(appointmentConstraintRepository, times(1)).findById(1L);
    }

    /**
     * Test the deleteAppointmentConstraint method of the controller.
     */
    @Test
    public void testDeleteAppointmentConstraint() {
        // Mock data: Create a sample AppointmentConstraint with ID 1
        AppointmentConstraint existingAppointmentConstraint = new AppointmentConstraint(LocalDate.now(), "course123", true);
        existingAppointmentConstraint.setId(1L);
        // Mock behavior: When findById() is called on the repository, return the existing data
        when(appointmentConstraintRepository.findById(1L)).thenReturn(Optional.of(existingAppointmentConstraint));

        // Call the controller method
        ResponseEntity<Void> responseEntity = appointmentConstraintController.deleteAppointmentConstraint(1L);

        // Verify the response
        assertEquals(HttpStatus.NO_CONTENT, responseEntity.getStatusCode());

        // Verify that the repository's findById() method was called once with the correct ID
        verify(appointmentConstraintRepository, times(1)).findById(1L);
        // Verify that the repository's deleteById() method was called once with the correct ID
        verify(appointmentConstraintRepository, times(1)).deleteById(1L);
    }

    /**
     * Test the deleteAllAppointmentConstraints method of the controller.
     */
    @Test
    public void testDeleteAllAppointmentConstraints() {
        // Call the controller method
        ResponseEntity<Void> responseEntity = appointmentConstraintController.deleteAllAppointmentConstraints();

        // Verify the response
        assertEquals(HttpStatus.NO_CONTENT, responseEntity.getStatusCode());

        // Verify that the repository's deleteAll() method was called once
        verify(appointmentConstraintRepository, times(1)).deleteAll();
    }

    /**
     * Test the getAllAppointmentsArray method of the controller.
     */
    @Test
    public void testGetAllAppointmentsArray() {
        // Mock data: Create a list with a sample AppointmentConstraint
        List<AppointmentConstraint> appointmentConstraints = Collections.singletonList(new AppointmentConstraint());
        // Mock behavior: When findAll() is called on the repository, return the sample data
        when(appointmentConstraintRepository.findAll()).thenReturn(appointmentConstraints);

        // Call the controller method
        ResponseEntity<List<AppointmentConstraint>> responseEntity = appointmentConstraintController.getAllAppointmentsArray();

        // Verify the response
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(appointmentConstraints, responseEntity.getBody());

        // Verify that the repository's findAll() method was called once
        verify(appointmentConstraintRepository, times(1)).findAll();
    }
}


