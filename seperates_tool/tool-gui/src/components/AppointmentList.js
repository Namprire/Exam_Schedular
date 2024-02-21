import React from 'react';
import deleteIcon from '../icons/trash-2.svg';

// Functional component for displaying a list of appointments
const AppointmentList = ({ appointments, onDelete, backendError }) => {
  return (
    // Add a container div with grid layout styling
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', paddingLeft: '50px' }}>
      
      {appointments.map((appointment) => (
        // Each appointment is represented as a list item with a unique key
        <div key={appointment.id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px' }}>
          <div>
            {/* Displaying the Course ID */}
            <strong>Kurs:</strong> {appointment.courseID}
          </div>
          <div>
            {/* Formatting and displaying the appointment date */}
            <strong>Datum:</strong> {formatDate(appointment.startDate)}
          </div>
          <div>
            {/* Displaying availability status */}
            <strong>Verfügbarkeit:</strong> {appointment.availability ? 'Favorit' : 'Geblockt'}
          </div>
          {/* Button for deleting an appointment, triggering onDelete callback */}
          <button onClick={() => onDelete(appointment.id)}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
              marginTop: '10px', // Add some space between the content and the button
            }}
          >
            {/* Delete icon displayed as a button */}
            <img
              src={deleteIcon}
              alt="Delete Icon"
              style={{ width: '30px', height: '30px' }}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

// Function to format a date string into a localized date format
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('de-DE', options);
  return formattedDate;
};

// Exporting the AppointmentList component as the default export
export default AppointmentList;





