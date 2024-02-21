package appointmentTool.controller;

import appointmentTool.AppointmentConstraintDTO;
import appointmentTool.entity.AppointmentConstraint;
import appointmentTool.repository.AppointmentConstraintRepository;
import appointmentTool.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointment-constraints")
public class AppointmentConstraintController {

    private final AppointmentConstraintRepository appointmentConstraintRepository;

    @Autowired
    public AppointmentConstraintController(AppointmentConstraintRepository appointmentConstraintRepository) {
        this.appointmentConstraintRepository = appointmentConstraintRepository;
    }

    /**
     * Retrieves a list of all appointment constraints.
     *
     * @return A ResponseEntity containing a list of AppointmentConstraint objects and an HTTP status code.
     */
    @GetMapping
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    public ResponseEntity<List<AppointmentConstraint>> getAllAppointmentConstraints() {
        List<AppointmentConstraint> appointmentConstraints = appointmentConstraintRepository.findAll();
        return new ResponseEntity<>(appointmentConstraints, HttpStatus.OK);
    }

    /**
     * Retrieves an appointment constraint by its ID.
     *
     * @param id The ID of the appointment constraint to retrieve.
     * @return A ResponseEntity containing an AppointmentConstraint object and an HTTP status code.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentConstraint> getAppointmentConstraintById(@PathVariable Long id) {
        Optional<AppointmentConstraint> appointmentConstraint = appointmentConstraintRepository.findById(id);
        if (appointmentConstraint.isPresent()) {
            return new ResponseEntity<>(appointmentConstraint.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Creates a new appointment constraint.
     *
     * @return A ResponseEntity containing the created AppointmentConstraint object and an HTTP status code.
     */

    @PostMapping
    public ResponseEntity<AppointmentConstraint> createAppointmentConstraint(@RequestBody AppointmentConstraintDTO appointmentDTO) {

        // Check for existing "favorit" appointments for the course
        boolean hasExistingFavorit = appointmentConstraintRepository.existsByCourseIDAndAvailability(appointmentDTO.getCourseID(), true);

        // Check for existing entry with the same course name and date
        boolean hasExistingEntry = appointmentConstraintRepository.existsByCourseIDAndDate(appointmentDTO.getCourseID(), appointmentDTO.getDate());

        // If a "favorit" for the course already exists or an entry with the same course name and date exists, return 409 code (caught by the frontend)
        if (hasExistingFavorit || hasExistingEntry) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // Return a 409 Conflict status code
        }

        // Convert AppointmentDTO to AppointmentConstraint
        AppointmentConstraint appointmentConstraint = new AppointmentConstraint(
                appointmentDTO.getDate(),
                appointmentDTO.getCourseID(),
                appointmentDTO.isAvailability()
        );

        // Save the appointmentConstraint using the repository
        AppointmentConstraint createdAppointmentConstraint = appointmentConstraintRepository.save(appointmentConstraint);

        return new ResponseEntity<>(createdAppointmentConstraint, HttpStatus.CREATED);
    }



    /**
     * Deletes an appointment constraint.
     *
     * @param id The ID of the appointment constraint to delete.
     * @return An empty ResponseEntity with an HTTP status code.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointmentConstraint(@PathVariable Long id) {
        Optional<AppointmentConstraint> existingAppointmentConstraint = appointmentConstraintRepository.findById(id);
        if (existingAppointmentConstraint.isPresent()) {
            appointmentConstraintRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAllAppointmentConstraints() {
        appointmentConstraintRepository.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Retrieves all appointment constraints as an array.
     *
     * @return A ResponseEntity containing an array of AppointmentConstraint objects and an HTTP status code.
     */
    @GetMapping("/all")
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    public ResponseEntity<List<AppointmentConstraint>> getAllAppointmentsArray() {
        List<AppointmentConstraint> appointmentConstraints = appointmentConstraintRepository.findAll();
        return new ResponseEntity<>(appointmentConstraints, HttpStatus.OK);
    }
}

