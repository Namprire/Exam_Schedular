package appointmentTool.repository;

import appointmentTool.entity.AppointmentConstraint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
/**
 * Repository interface for managing AppointmentConstraint entities.
 */
@Repository
public interface AppointmentConstraintRepository extends JpaRepository<AppointmentConstraint, Long> {
    /**
     * Checks if an appointment constraint with the specified course ID and availability exists.
     *
     * @param courseID      The course ID to check.
     * @param isFavourite   The availability to check.
     * @return              True if an appointment constraint exists; false otherwise.
     */
    @Query("SELECT CASE WHEN COUNT(ac) > 0 THEN true ELSE false END FROM AppointmentConstraint ac WHERE ac.courseID = :courseID AND ac.isFavourite = :isFavourite")
    boolean existsByCourseIDAndAvailability(@Param("courseID") String courseID, @Param("isFavourite") boolean isFavourite);
    /**
     * Checks if an appointment constraint with the specified course ID and date exists.
     *
     * @param courseID  The course ID to check.
     * @param date      The date to check.
     * @return          True if an appointment constraint exists; false otherwise.
     */
    @Query("SELECT CASE WHEN COUNT(ac) > 0 THEN true ELSE false END FROM AppointmentConstraint ac WHERE ac.courseID = :courseID AND ac.date = :date")
    boolean existsByCourseIDAndDate(@Param("courseID") String courseID, @Param("date") LocalDate date);
}
