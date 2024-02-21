import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import axios from 'axios'; 
import downloadIcon from '../icons/download.svg';
import deleteIcon from '../icons/trash-2.svg';

const AppointmentTool = () => {
  const [appointments, setAppointments] = useState([]);
  const [backendError, setBackendError] = useState(null); //new state for backend errors


  useEffect(() => {
    // Fetch appointments from the backend on component mount
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/appointment-constraints');
        setAppointments(response.data);
        setBackendError(null); // Clear backend error on successful response
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setBackendError('Backend muss gestartet werden'); // Set backend error when there's an issue
      }
    };

    fetchAppointments();
  }, []);

  const createAppointment = async (newAppointment) => {
    try {
      const response = await axios.post('http://localhost:8080/api/appointment-constraints', newAppointment);
  
      if (response.status === 201) {
        // Successful creation
        setAppointments([...appointments, response.data]);
        setBackendError(null); // Clear backend error on success
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
  
      if (error.response && error.response.status === 409) {
        // Conflict: Existing "favorit" appointment for the course
        setBackendError('Ein Termin für diesen Kurs existiert bereits.');
        // Delay the removal of the error message to give users more time to read it
      setTimeout(() => {
        setBackendError(null);
      }, 7000); // Delay time (in milliseconds)
      } else {
        // Other errors
        setBackendError('Bitte starten Sie das Backend und versuchen Sie es erneut');
      }
    }
  };

  

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/appointment-constraints/${appointmentId}`);
      const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const deleteAllAppointments = async () => {
    try {
      await axios.delete('http://localhost:8080/api/appointment-constraints/delete-all');
      setAppointments([]); // Clear appointments on the frontend
    } catch (error) {
      console.error('Error deleting all appointments:', error);
    }
  };
  

  const exportAppointments = () => {
    // Create a new array with appointments excluding the "id" attribute
    const appointmentsWithoutId = appointments.map(({ id, ...rest }) => rest);
  
    const jsonContent = JSON.stringify(appointmentsWithoutId, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Terminwünsche</h1>

      {/* Pass backendError to AppointmentForm */}
      <div style={{ marginBottom: '20px' }}>
        <AppointmentForm onSubmit={createAppointment}backendError={backendError}/>
      </div>

      {/* Appointments container with styling */}
      {appointments.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
        }}>

        {/* Display backend error if present */}
        {backendError && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {backendError}
          </div>
        )}

          <hr style={{ width: '80%', margin: '10px 0' }} /> {/* Horizontal line separating constraints */}
          
          {/* Pass backendError to AppointmentList */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px', 
            width: '80%',  // Adjust the width as needed
            margin: '20px auto',  // Center the container
          }}>
            {/* AppointmentList with additional styling */}
            
              <AppointmentList appointments={appointments}  onDelete={deleteAppointment} backendError={backendError}/>
            
          </div>
        </div>
      )}

      {appointments.length > 0 && (
        <button onClick={deleteAllAppointments}
        style={{
          border: 'none',    // Remove border
          background: 'none', // Remove background
          padding: 0,         // Remove padding
          cursor: 'pointer',  // Add pointer cursor
          color: 'red', // Set text color to red
          fontWeight: 'bold', // Make text bold
        }}
        >
          <img
              src={deleteIcon}
              alt="Delete Icon"
              style={{ width: '30px', height: '30px' }}
            />
          Alle Termine Löschen
        </button>
      )}

      <button onClick={exportAppointments}
        style={{
          border: 'none',    // Remove border
          background: 'none', // Remove background
          padding: 0,         // Remove padding
          cursor: 'pointer',  // Add pointer cursor
        }}
      >
        <img
          src={downloadIcon} // Use the imported icon
          alt="Download Icon"
          style={{ width: '30px', height: '30px' }}
        />
        Termine exportieren
      </button>
    </div>
  );
};

export default AppointmentTool;

