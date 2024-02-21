package appointmentTool;

import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for representing AppointmentConstraint information.
 * This class is used to transfer data between the frontend and backend.
 */
public class AppointmentConstraintDTO {

    private String courseID;
    private LocalDate date;
    private boolean availability;

    /**
     * Constructor for creating an AppointmentConstraintDTO object.
     *
     * @param courseID      The course ID associated with the appointment constraint.
     * @param date          The date of the appointment constraint.
     * @param availability  The availability status of the appointment constraint.
     */
    public AppointmentConstraintDTO(String courseID, LocalDate date, boolean availability) {
        this.courseID = courseID;
        this.date = date;
        this.availability = availability;
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
     * Gets the date of the appointment constraint.
     *
     * @return The date.
     */
    public LocalDate getDate() {
        return date;
    }

    /**
     * Sets the date for the appointment constraint.
     *
     * @param date The date to set.
     */
    public void setDate(LocalDate date) {
        this.date = date;
    }

    /**
     * Checks the availability status of the appointment constraint.
     *
     * @return True if the appointment constraint is available, false otherwise.
     */
    public boolean isAvailability() {
        return availability;
    }

    /**
     * Sets the availability status for the appointment constraint.
     *
     * @param availability The availability status to set.
     */
    public void setAvailability(boolean availability) {
        this.availability = availability;
    }
}

