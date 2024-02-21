package appointmentTool.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity class representing an AppointmentConstraint.
 * This class is used to map the AppointmentConstraint entity to a database table.
 */
@Entity
@Table(name = "appointment_constraints")
public class AppointmentConstraint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Modify to single day (each constraint corresponds to one day)
    @Column(name = "date")
    private LocalDate date;

    @Column(name = "course_id")
    private String courseID;

    @Column(name = "isFavourite")
    private boolean isFavourite;

    /**
     * Default constructor for AppointmentConstraint.
     */
    public AppointmentConstraint() {
    }

    /**
     * Constructor for creating an AppointmentConstraint with specified attributes.
     *
     * @param startDate      The date of the appointment constraint.
     * @param courseID       The course ID associated with the appointment constraint.
     * @param availability   The availability status of the appointment constraint.
     */
    public AppointmentConstraint(LocalDate startDate, String courseID, boolean availability) {
        this.date = startDate;
        this.courseID = courseID;
        this.isFavourite = availability;
    }

    /**
     * Gets the unique identifier of the appointment constraint.
     *
     * @return The unique identifier.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique identifier for the appointment constraint.
     *
     * @param id The unique identifier to set.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the date of the appointment constraint.
     *
     * @return The date.
     */
    public LocalDate getStartDate() {
        return date;
    }

    /**
     * Sets the date for the appointment constraint.
     *
     * @param startDate The date to set.
     */
    public void setStartDate(LocalDate startDate) {
        this.date = startDate;
    }

    /**
     * Gets the course ID associated with the appointment constraint.
     *
     * @return The course ID.
     */
    public String getCourseID() {
        return courseID;
    }

    /**
     * Sets the course ID for the appointment constraint.
     *
     * @param courseID The course ID to set.
     */
    public void setCourseID(String courseID) {
        this.courseID = courseID;
    }

    /**
     * Checks the availability status of the appointment constraint.
     *
     * @return True if the appointment constraint is available, false otherwise.
     */
    public boolean isAvailability() {
        return isFavourite;
    }

    /**
     * Sets the availability status for the appointment constraint.
     *
     * @param availability The availability status to set.
     */
    public void setAvailability(boolean availability) {
        this.isFavourite = availability;
    }
}


