package appointmentTool;

import appointmentTool.entity.AppointmentConstraint;
import appointmentTool.repository.AppointmentConstraintRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentConstraintRepositoryTest {

    @Mock
    private AppointmentConstraintRepository appointmentConstraintRepository;

    @Test
    public void testExistsByCourseIDAndAvailability() {
        // Mock data
        when(appointmentConstraintRepository.existsByCourseIDAndAvailability(anyString(), anyBoolean())).thenReturn(true);

        // Call the repository method
        boolean result = appointmentConstraintRepository.existsByCourseIDAndAvailability("course123", true);

        // Verify the result
        assertTrue(result);
    }

    @Test
    public void testExistsByCourseIDAndDate() {
        // Mock data
        when(appointmentConstraintRepository.existsByCourseIDAndDate(anyString(), any(LocalDate.class))).thenReturn(true);

        // Call the repository method
        boolean result = appointmentConstraintRepository.existsByCourseIDAndDate("course123", LocalDate.now());

        // Verify the result
        assertTrue(result);
    }

    // Add more tests for other repository methods if needed
}

